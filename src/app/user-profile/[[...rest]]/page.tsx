'use client';

import { SignedIn, SignedOut, SignInButton, UserProfile } from '@clerk/nextjs';
import { Navbar } from '@/app/components/Navbar';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { clerkAppearance, clerkEnabled } from '@/lib/clerk-appearance';

export default function UserProfilePage() {
  if (!clerkEnabled) {
    return (
      <div className="min-h-screen bg-background text-white pb-20">
        <Navbar activeView="profile" />
        <main id="main-content" tabIndex={-1} className="pt-32 max-w-3xl mx-auto px-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <h1 className="text-2xl font-display font-semibold">Connect Clerk</h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Add <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code>
              to enable profile management.
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200"
            >
              Back to profile
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Navbar activeView="profile" />
      <main id="main-content" tabIndex={-1} className="pt-32 max-w-5xl mx-auto px-6">
        <SignedIn>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-6">
            <UserProfile path="/user-profile" routing="path" appearance={clerkAppearance} />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4 text-center">
            <h1 className="text-2xl font-display font-semibold">Sign in to manage your profile</h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Use your Clerk account to update your personal details, security, and connected
              sessions.
            </p>
            <SignInButton mode="modal" forceRedirectUrl="/profile">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white text-background text-sm font-semibold px-5 py-3 hover:bg-brand-50 transition-colors">
                Sign in
              </button>
            </SignInButton>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200"
            >
              Back to profile
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}
