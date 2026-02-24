import { verifyWebhook, type WebhookEvent } from '@clerk/nextjs/webhooks';
import db from '@/lib/db';

const RETRY_DELAYS_MS = [200, 600];

type ClerkUserPayload = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: Array<{ id?: string; email_address: string }>;
};

function resolvePrimaryEmail(user: ClerkUserPayload) {
  const addresses = user.email_addresses ?? [];
  if (user.primary_email_address_id) {
    const primary = addresses.find((address) => address.id === user.primary_email_address_id);
    if (primary?.email_address) return primary.email_address;
  }
  return addresses[0]?.email_address ?? null;
}

function resolveDisplayName(user: ClerkUserPayload) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return name.length > 0 ? name : null;
}

async function withRetry<T>(
  action: () => Promise<T>,
  context: { eventType: string; userId: string; label: string }
) {
  let attempt = 0;
  while (true) {
    try {
      const result = await action();
      if (attempt > 0) {
        console.info('Clerk webhook recovered after retry', {
          eventType: context.eventType,
          userId: context.userId,
          attempt
        });
      }
      return result;
    } catch (error) {
      if (attempt >= RETRY_DELAYS_MS.length) {
        console.error('Clerk webhook failed', {
          eventType: context.eventType,
          userId: context.userId,
          attempt,
          label: context.label
        }, error);
        throw error;
      }
      console.warn('Clerk webhook retrying', {
        eventType: context.eventType,
        userId: context.userId,
        attempt: attempt + 1,
        label: context.label
      });
      const delay = RETRY_DELAYS_MS[attempt];
      attempt += 1;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function POST(req: Request) {
  let event: WebhookEvent;
  try {
    event = await verifyWebhook(req);
  } catch (error) {
    console.error('Clerk webhook verification failed', error);
    return new Response('Webhook verification failed', { status: 400 });
  }

  if (event.type === 'user.created' || event.type === 'user.updated') {
    const user = event.data as ClerkUserPayload;
    const email = resolvePrimaryEmail(user);
    if (!email) {
      console.warn('Clerk webhook missing email address', { userId: user.id });
      return new Response('Missing email address', { status: 200 });
    }

    const name = resolveDisplayName(user);
    const imageUrl = user.image_url ?? null;

    await withRetry(
      () =>
        db.user.upsert({
          where: { id: user.id },
          create: {
            id: user.id,
            email,
            name,
            imageUrl,
            dna: { create: {} }
          },
          update: {
            email,
            name,
            imageUrl
          }
        }),
      { eventType: event.type, userId: user.id, label: 'user.upsert' }
    );
    console.info('Clerk webhook synced user', { eventType: event.type, userId: user.id });
  }

  if (event.type === 'user.deleted') {
    const userId = event.data?.id;
    if (typeof userId === 'string') {
      const result = await withRetry(
        () => db.user.deleteMany({ where: { id: userId } }),
        { eventType: event.type, userId, label: 'user.delete' }
      );
      if (result.count === 0) {
        console.warn('Clerk webhook delete skipped (user not found)', { userId });
      }
    }
  }

  return new Response('ok', { status: 200 });
}

