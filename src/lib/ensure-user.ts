import { currentUser } from '@/lib/auth';
import db from '@/lib/db';

/** Ensures a Prisma User row exists for the given Clerk (or dev) user id. */
export async function ensureDbUser(userId: string) {
  const existing = await db.user.findUnique({ where: { id: userId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${userId}@local.dev`;
  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ').trim() || null;

  return db.user.create({
    data: {
      id: userId,
      email,
      name,
      imageUrl: clerkUser?.imageUrl ?? null,
      dna: { create: {} },
    },
  });
}
