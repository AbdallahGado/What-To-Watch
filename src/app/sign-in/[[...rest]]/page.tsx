'use client';

import { SignIn } from '@clerk/nextjs';
import { AuthPageLayout } from '@/app/components/AuthPageLayout';
import { clerkAppearance, clerkEnabled } from '@/lib/clerk-appearance';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SignInPage() {
  if (!clerkEnabled) {
    return (
      <AuthPageLayout>
        <div className="glass-panel space-y-4 rounded-3xl border border-white/10 p-8">
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
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout>
      <SignIn
        path="/sign-in"
        routing="path"
        appearance={clerkAppearance}
        forceRedirectUrl="/profile"
        signUpUrl="/sign-up"
      />
    </AuthPageLayout>
  );
}
