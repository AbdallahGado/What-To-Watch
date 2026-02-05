// Clerk webhook disabled in local dev mode.
// For production, implement Clerk webhook handling here.

export async function POST(req: Request) {
  console.log('Webhook received (no-op in dev mode)');
  return new Response('', { status: 200 });
}

