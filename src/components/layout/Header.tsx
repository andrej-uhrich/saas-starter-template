'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'
import { getInitials } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, signOut, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      setIsUserMenuOpen(false)
    } catch {
      // Silently handle logout errors
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="saas-container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                SaaS Starter
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium">
                  About
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">
                  Pricing
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                <span className="text-gray-600">Loading...</span>
              </div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none bg-green-50 border border-green-200 rounded-md px-3 py-2"
                >
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {user.name ? getInitials(user.name) : user.email ? getInitials(user.email) : 'U'}
                    </span>
                  </div>
                  <span className="font-medium text-sm">
                    {user.name || user.email || 'User'}
                  </span>
                  <span className="text-xs">▼</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="saas-button-primary"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 bg-gray-600 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-4">
              <Link href="/about" className="block text-gray-600 hover:text-gray-900 font-medium">
                About
              </Link>
              <Link href="/pricing" className="block text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </Link>
              {user && (
                <Link href="/dashboard" className="block text-gray-600 hover:text-gray-900 font-medium">
                  Dashboard
                </Link>
              )}

              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 py-2">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 text-xs font-medium">
                          {getInitials(user.name || user.email || 'U')}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {user.name || user.email}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block text-gray-600 hover:text-gray-900 font-medium">
                      Sign in
                    </Link>
                    <Link href="/register" className="block saas-button-primary text-center">
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
