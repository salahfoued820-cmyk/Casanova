'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              🎰 Cassanova
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/games" className="hover:text-yellow-400 transition-colors font-medium">
              Games
            </Link>
            <Link href="/live-casino" className="hover:text-yellow-400 transition-colors font-medium">
              Live Casino
            </Link>
            <Link href="/promotions" className="hover:text-yellow-400 transition-colors font-medium">
              Promotions
            </Link>
            <Link href="/vip" className="hover:text-yellow-400 transition-colors font-medium">
              VIP
            </Link>
          </nav>

          {/* Auth Buttons / User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-1.5 rounded-lg bg-green-600/20 border border-green-500/40 text-green-300 font-bold text-sm">
                  TND {user.balance?.toFixed(2) || '0.00'}
                </div>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium text-yellow-400"
                >
                  👤 {user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition-colors font-medium text-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Balance */}
          <div className="flex items-center gap-3 md:hidden">
            {isAuthenticated && user && (
              <Link
                href="/dashboard"
                className="px-3 py-1 rounded-lg bg-green-600/30 border border-green-500/40 text-green-300 font-bold text-xs"
              >
                TND {user.balance?.toFixed(2) || '0.00'}
              </Link>
            )}
            <button
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              {isAuthenticated && user && (
                <div className="p-3 rounded-lg bg-white/5 border border-yellow-500/30 flex justify-between items-center">
                  <span className="text-yellow-400 font-bold">👤 {user.username}</span>
                  <span className="text-green-400 font-bold">TND {user.balance?.toFixed(2) || '0.00'}</span>
                </div>
              )}
              <Link href="/games" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-400 transition-colors">
                Games
              </Link>
              <Link href="/live-casino" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-400 transition-colors">
                Live Casino
              </Link>
              <Link href="/promotions" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-400 transition-colors">
                Promotions
              </Link>
              <Link href="/vip" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-400 transition-colors">
                VIP
              </Link>

              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-6 py-2 rounded-lg bg-yellow-500 text-gray-900 font-bold text-center"
                  >
                    حسابي (Dashboard)
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold text-center"
                  >
                    تسجيل الخروج (Log Out)
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-400 transition-colors">
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-bold text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
