'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import { SearchOverlay } from './SearchOverlay';

interface NavbarProps {
  activeView?: string;
}

const NAV_LINKS = [
  { id: 'home', label: 'Discover', href: '/', desc: 'Trending picks and highlights' },
  { id: 'movies', label: 'Movies', href: '/movies', desc: 'New releases and classics' },
  { id: 'series', label: 'Series', href: '/series', desc: 'Bingeable shows and hits' },
  { id: 'list', label: 'Watchlist', href: '/collection', desc: 'Your saved movies and series' },
  { id: 'mood', label: 'Mood Match', href: '/what-to-watch', desc: 'Find something fast' },
] as const;

const NavbarComponent = ({ activeView = 'home' }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true);
    setIsMenuOpen(false);
  }, []);
  const handleSearchClose = useCallback(() => setIsSearchOpen(false), []);
  const handleMenuOpen = useCallback(() => setIsMenuOpen(true), []);
  const handleMenuClose = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const menuTrigger = menuTriggerRef.current;
    document.body.style.overflow = 'hidden';
    menuRef.current
      ?.querySelector<HTMLElement>('button, a[href]')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      menuTrigger?.focus();
    };
  }, [isMenuOpen]);

  const handleMenuKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      handleMenuClose();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, [handleMenuClose]);

  return (
    <>
      <div className="fixed top-4 md:top-5 left-0 right-0 z-50 px-4 md:px-6 flex justify-center pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto w-full max-w-4xl flex items-center gap-2 rounded-xl border backdrop-blur-md transition-all duration-500 md:rounded-full ${
            isScrolled
              ? 'bg-black/45 border-white/10 shadow-2xl shadow-black/20'
              : 'bg-black/25 border-white/10'
          } p-2 md:px-3 md:py-1.5`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="text-sm md:text-base font-display font-medium tracking-wide text-white flex items-center gap-1.5 group whitespace-nowrap"
              aria-label="What To Watch - Home"
            >
              <span className="hidden sm:inline">What To Watch</span>
              <span className="sm:hidden">WTW</span>
              <div
                className="w-1.5 h-1.5 rounded-full bg-brand-400 group-hover:scale-125 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`relative px-1 py-0.5 text-[12px] font-medium transition-all duration-300 whitespace-nowrap ${
                  activeView === link.id ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                aria-current={activeView === link.id ? 'page' : undefined}
              >
                <span className="relative z-10 px-1">{link.label}</span>
                {activeView === link.id && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute left-1.5 right-1.5 -bottom-0.5 h-0.5 rounded-full bg-white/60"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={handleSearchOpen}
              className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Open search"
              type="button"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <Link
              href="/profile"
              className="hidden md:inline-flex px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[12px] font-medium hover:bg-white/20 transition-all text-white"
            >
              Profile
            </Link>

            <button
              ref={menuTriggerRef}
              onClick={handleMenuOpen}
              className="inline-flex md:hidden w-9 h-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              <Menu className="w-4 h-4" aria-hidden="true" />
            </button>
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
              ref={menuRef}
              id="mobile-menu"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm rounded-l-3xl border-l border-white/10 bg-[#0b0d11]/95 backdrop-blur-2xl shadow-2xl shadow-black/40 p-5 md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
              onKeyDown={handleMenuKeyDown}
              tabIndex={-1}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Menu</span>
                  <span className="text-xs text-white/40">What To Watch</span>
                </div>
                <button
                  onClick={handleMenuClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                  type="button"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-1 space-y-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={handleMenuClose}
                    className={`group flex items-center justify-between rounded-2xl border px-3 py-3 transition-all ${
                      activeView === link.id
                        ? 'border-white/20 bg-white/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-current={activeView === link.id ? 'page' : undefined}
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold">{link.label}</div>
                      <div className="text-[11px] text-white/40">{link.desc}</div>
                    </div>
                    <div className="h-7 w-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-colors">
                      <span className="text-xs">→</span>
                    </div>
                  </Link>
                ))}

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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export const Navbar = memo(NavbarComponent);
