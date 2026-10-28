'use client';

import { SignIn } from '@clerk/nextjs';
import { Navbar } from '@/app/components/Navbar';
import { clerkAppearance, clerkEnabled } from '@/lib/clerk-appearance';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SignInPage() {
  if (!clerkEnabled) {
    return (
      <div className="min-h-screen bg-background text-white pb-20">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="pt-32 max-w-3xl mx-auto px-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <h1 className="text-2xl font-display font-semibold">Connect Clerk</h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Add <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code>
              to enable authentication.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200"
            >
              Back home
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-32 max-w-5xl mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-6">
          <SignIn
            path="/sign-in"
            routing="path"
            appearance={clerkAppearance}
            forceRedirectUrl="/profile"
            signUpUrl="/sign-up"
          />
        </div>
      </main>
    </div>
  );
}
