'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, LogIn, Menu, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, clerkEnabled } from '@/lib/auth-client';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

type NavView = 'home' | 'movies' | 'series' | 'list' | 'mood' | 'profile';
type NavLinkId = Exclude<NavView, 'profile'>;

interface NavbarProps {
  activeView?: NavView;
}

const NAV_LINKS = [
  { id: 'home', label: 'Discover', href: '/', desc: 'Trending picks and highlights' },
  { id: 'movies', label: 'Movies', href: '/movies', desc: 'New releases and classics' },
  { id: 'series', label: 'Series', href: '/series', desc: 'Bingeable shows and hits' },
  { id: 'list', label: 'Collection', href: '/collection', desc: 'Your saved watchlist' },
  { id: 'mood', label: 'Mood Match', href: '/what-to-watch', desc: 'Find something fast' },
] as const satisfies ReadonlyArray<{
  id: NavLinkId;
  label: string;
  href: string;
  desc: string;
}>;

const NAV_SCROLL_OFFSET = 24;
const NAV_SCROLL_DELTA = 6;
const SearchOverlay = dynamic(
  () => import('./SearchOverlay').then((mod) => mod.SearchOverlay),
  { ssr: false }
);

const NavbarComponent = ({ activeView = 'home' }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const lastKnownScrollY = useRef(0);
  const lastIsScrolled = useRef(false);
  const lastIsVisible = useRef(true);
  const ticking = useRef(false);

  const updateFromScroll = useCallback(() => {
    const currentY = lastKnownScrollY.current;
    const delta = currentY - lastScrollY.current;
    const nextIsScrolled = currentY > NAV_SCROLL_OFFSET;

    if (nextIsScrolled !== lastIsScrolled.current) {
      lastIsScrolled.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    }

    if (currentY <= NAV_SCROLL_OFFSET) {
      if (!lastIsVisible.current) {
        lastIsVisible.current = true;
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
      return;
    }

    if (Math.abs(delta) < NAV_SCROLL_DELTA) {
      lastScrollY.current = currentY;
      return;
    }

    const nextIsVisible = delta < 0;
    if (nextIsVisible !== lastIsVisible.current) {
      lastIsVisible.current = nextIsVisible;
      setIsVisible(nextIsVisible);
    }

    lastScrollY.current = currentY;
  }, []);

  const handleScroll = useCallback(() => {
    lastKnownScrollY.current = window.scrollY || document.documentElement.scrollTop;
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      updateFromScroll();
      ticking.current = false;
    });
  }, [updateFromScroll]);

  useEffect(() => {
    lastScrollY.current = window.scrollY || document.documentElement.scrollTop;
    lastKnownScrollY.current = lastScrollY.current;
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      lastIsVisible.current = true;
      setIsVisible(true);
    }
  }, [isMenuOpen, isSearchOpen]);

  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true);
    setIsMenuOpen(false);
  }, []);
  const handleSearchClose = useCallback(() => setIsSearchOpen(false), []);
  const handleMenuOpen = useCallback(() => setIsMenuOpen(true), []);
  const handleMenuClose = useCallback(() => setIsMenuOpen(false), []);

  useLockBodyScroll(isMenuOpen);

  return (
    <>
      <div className="fixed top-3 md:top-4 left-0 right-0 z-50 px-3 md:px-4 flex justify-center pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: isVisible ? 0 : -120, 
            opacity: isVisible ? 1 : 0,
            backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.35)',
            borderColor: isScrolled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            boxShadow: isScrolled ? '0 8px 32px rgba(0,0,0,0.5)' : 'none'
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.8 }}
          style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
          className="pointer-events-auto w-full max-w-3xl flex items-center gap-2 rounded-xl border backdrop-blur-xl md:rounded-full p-2 md:px-3 md:py-1.5"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-lg md:text-xl font-display font-medium tracking-wide text-white flex items-center gap-1 group"
              aria-label="What To Watch - Home"
            >
              WTW
              <motion.div
                whileHover={{ scale: 1.25 }}
                className="w-1.5 h-1.5 rounded-full bg-brand-400 ml-0.5 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`relative px-1 py-0.5 text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeView === link.id ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                aria-current={activeView === link.id ? 'page' : undefined}
              >
                <span className="relative z-10 px-1">{link.label}</span>
                <AnimatePresence mode="popLayout">
                  {activeView === link.id && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-brand-400 to-accent-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.5 }}
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSearchOpen}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white transition-colors"
              aria-label="Open search"
              type="button"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </motion.button>

            {clerkEnabled && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
              <>
                <SignedOut>
                  <SignInButton mode="modal" forceRedirectUrl="/profile">
                    <button
                      type="button"
                      className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium transition-all text-white bg-white/10 border-white/10 hover:bg-white/20"
                    >
                      <LogIn className="w-4 h-4" aria-hidden="true" />
                      Sign in
                    </button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <Link
                    href="/profile"
                    className={`hidden md:inline-flex px-3 py-1 rounded-full border text-sm font-medium transition-all text-white ${
                      activeView === 'profile'
                        ? 'bg-white/20 border-white/20'
                        : 'bg-white/10 border-white/10 hover:bg-white/20'
                    }`}
                  >
                    Profile
                  </Link>
                  <div className="hidden md:flex items-center justify-center">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </>
            ) : (
              <Link
                href={"/sign-in" as any}
                className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium transition-all text-white bg-white/10 border-white/10 hover:bg-white/20"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Sign in
              </Link>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMenuOpen}
              className="inline-flex md:hidden w-9 h-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              <Menu className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={handleMenuClose}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm rounded-l-3xl border-l border-white/10 bg-[#0b0d11]/95 backdrop-blur-2xl shadow-2xl shadow-black/40 p-5 md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center border border-brand-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Menu</div>
                    <div className="text-[10px] uppercase tracking-wider text-white/40">What to Watch</div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleMenuClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                  type="button"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </motion.button>
              </div>

              <div className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-1 space-y-2">
                {NAV_LINKS.map((link, idx) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={handleMenuClose}
                      className={`group flex items-center justify-between rounded-2xl border px-3 py-3 transition-all ${
                        activeView === link.id
                          ? 'border-brand-500/30 bg-brand-500/10 text-white'
                          : 'border-white/5 bg-white/[0.03] text-white/80 hover:bg-white/[0.08] hover:text-white'
                      }`}
                      aria-current={activeView === link.id ? 'page' : undefined}
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">{link.label}</div>
                        <div className="text-[11px] text-white/40">{link.desc}</div>
                      </div>
                      <div className={`h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-colors ${
                        activeView === link.id ? 'bg-brand-500 text-white border-none' : ''
                      }`}>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {clerkEnabled && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
                  <>
                    <SignedIn>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-white">Profile</div>
                            <div className="text-[11px] text-white/40">Account & settings</div>
                          </div>
                          <Link
                            href="/profile"
                            onClick={handleMenuClose}
                            className="px-3 py-1.5 rounded-full bg-white text-background text-[11px] font-semibold hover:bg-brand-50 transition-colors"
                          >
                            Open
                          </Link>
                        </div>
                      </div>
                      <SignOutButton>
                        <button
                          type="button"
                          onClick={handleMenuClose}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                        >
                          Sign out
                        </button>
                      </SignOutButton>
                    </SignedIn>

                    <SignedOut>
                      <SignInButton mode="modal" forceRedirectUrl="/profile">
                        <button
                          type="button"
                          onClick={handleMenuClose}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <LogIn className="w-4 h-4" aria-hidden="true" />
                          Sign in
                        </button>
                      </SignInButton>
                      <Link
                        href={"/sign-up" as any}
                        onClick={handleMenuClose}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                      >
                        Create account
                      </Link>
                    </SignedOut>
                  </>
                ) : (
                  <>
                    <Link
                      href={"/sign-in" as any}
                      onClick={handleMenuClose}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" aria-hidden="true" />
                      Sign in
                    </Link>
                    <Link
                      href={"/sign-up" as any}
                      onClick={handleMenuClose}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                    >
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isSearchOpen ? <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} /> : null}
    </>
  );
};

export const Navbar = memo(NavbarComponent);
