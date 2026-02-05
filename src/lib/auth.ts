// Minimal auth shim to replace Clerk during local development
// Exports `auth` and `currentUser` used by server actions/pages.

export async function auth() {
  // Return a fake user in dev if DEV_USER_ID is set, otherwise unauthenticated
  const userId = process.env.DEV_USER_ID ?? null;
  return { userId };
}

export async function currentUser() {
  const userId = process.env.DEV_USER_ID ?? null;
  if (!userId) return null;
  return { id: userId, email: null, name: null, imageUrl: null };
}

// Client-side placeholder components (no-op)
export const SignInButton = ({ children }: { children: any }) => children;
export const UserButton = () => null;
export const SignedIn = ({ children }: { children: any }) => children;
export const SignedOut = ({ children }: { children: any }) => children;
