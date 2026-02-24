import 'server-only';

import { auth as clerkAuth, currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import { clerkEnabled } from '@/lib/clerk-appearance';

const clerkServerEnabled = clerkEnabled && Boolean(process.env.CLERK_SECRET_KEY);

export async function auth() {
  if (!clerkServerEnabled) {
    return { userId: null };
  }
  return clerkAuth();
}

export async function currentUser() {
  if (!clerkServerEnabled) {
    return null;
  }
  return clerkCurrentUser();
}
