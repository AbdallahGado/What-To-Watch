export const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export const clerkAppearance = {
  variables: {
    colorPrimary: '#7c5cff',
    colorBackground: '#0b0d11',
    colorText: '#f8fafc',
    colorTextSecondary: 'rgba(255, 255, 255, 0.6)',
    colorInputBackground: 'rgba(255, 255, 255, 0.08)',
    colorInputText: '#f8fafc',
    borderRadius: '18px',
    fontFamily: 'var(--font-display), var(--font-sans)'
  },
  elements: {
    card: 'bg-[#0b0d11] border border-white/10 shadow-2xl shadow-black/40',
    navbar: 'bg-transparent border-b border-white/10',
    headerTitle: 'text-white font-display',
    headerSubtitle: 'text-white/60',
    formButtonPrimary:
      'bg-white text-background hover:bg-brand-50 shadow-lg shadow-white/10 rounded-2xl',
    formFieldLabel: 'text-white/70',
    formFieldInput:
      'bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:border-brand-400 focus:ring-brand-400/40',
    dividerLine: 'bg-white/10',
    dividerText: 'text-white/40'
  }
} as const;
