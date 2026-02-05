
'use client';

import React, { memo, useCallback, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserButton, SignInButton, SignedIn, SignedOut } from '@/lib/auth';

import { SearchOverlay } from './SearchOverlay';

interface NavbarProps {
  onSearch?: (query: string) => void;
  activeView?: string;
}

const NAV_LINKS = [
  { id: 'home', label: 'Discover', href: '/' },
  { id: 'movies', label: 'Movies', href: '/movies' },
  { id: 'series', label: 'Series', href: '/series' },
  { id: 'list', label: 'Collection', href: '/collection' },
  { id: 'mood', label: 'Mood Match', href: '/what-to-watch' },
  { id: 'profile', label: 'Profile', href: '/profile' },
] as const;

const NavbarComponent = ({ onSearch, activeView = 'home' }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Use useCallback to memoize scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSearchOpen = useCallback(() => setIsSearchOpen(true), []);
  const handleSearchClose = useCallback(() => setIsSearchOpen(false), []);

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto flex items-center gap-2 p-2 rounded-full transition-all duration-500 ${
            isScrolled 
              ? 'glass-panel shadow-2xl shadow-black/20' 
              : 'bg-black/20 backdrop-blur-md border border-white/5'
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo Area */}
          <div className="pl-6 pr-4 flex items-center">
            <Link 
              href="/" 
              className="text-xl font-display font-medium tracking-wide text-white flex items-center gap-1 group"
              aria-label="What To Watch - Home"
            >
              WTW
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 ml-0.5 group-hover:scale-125 transition-transform" aria-hidden="true" />
            </Link>
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-white/10 mx-2" aria-hidden="true" />

          {/* Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.id}
                href={link.href}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeView === link.id ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                aria-current={activeView === link.id ? 'page' : undefined}
              >
                <span className="relative z-10">{link.label}</span>
                {activeView === link.id && (
                  <motion.div 
                    layoutId="navPill"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Search Trigger */}
          <div className="relative flex items-center pl-2">
            <button 
              onClick={handleSearchOpen}
              className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Open search"
              type="button"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Auth Area - Using Local Auth Stub */}
          <div className="ml-2">
            <Link
              href="/profile"
              className="px-5 py-2 rounded-full bg-white/10 border border-white/5 text-sm font-medium hover:bg-white/20 transition-all text-white"
            >
              Profile
            </Link>
          </div>
        </motion.nav>
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export const Navbar = memo(NavbarComponent);
