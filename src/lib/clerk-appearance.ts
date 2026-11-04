export const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export const clerkAppearance = {
  variables: {
    colorPrimary: '#a855f7',
    colorBackground: '#0b0d11',
    colorText: '#f8fafc',
    colorTextSecondary: 'rgba(255, 255, 255, 0.6)',
    colorInputBackground: 'rgba(255, 255, 255, 0.08)',
    colorInputText: '#f8fafc',
    borderRadius: '18px',
    fontFamily: 'var(--font-display), var(--font-sans)'
  },
  elements: {
    card: 'w-full bg-transparent border-0 shadow-none',
    rootBox: 'w-full',
    socialButtonsBlockButton:
      'border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] transition-colors',
    socialButtonsBlockButtonText: 'font-medium text-white/85',
    socialButtonsProviderIcon: 'opacity-100',
    navbar: 'bg-transparent border-b border-white/10',
    headerTitle: 'text-white font-display',
    headerSubtitle: 'text-white/60',
    formButtonPrimary:
      'bg-brand-500 text-white hover:bg-brand-400 shadow-lg shadow-brand-500/20 rounded-2xl',
    formFieldLabel: 'text-white/70',
    formFieldInput:
      'bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:border-brand-400 focus:ring-brand-400/40',
    dividerLine: 'bg-white/10',
    dividerText: 'text-white/40',
    footerActionText: 'text-white/55',
    footerActionLink: 'text-brand-300 hover:text-brand-200',
    identityPreviewText: 'text-white',
    formFieldAction: 'text-brand-300 hover:text-brand-200',
    alertText: 'text-red-300'
  }
} as const;
