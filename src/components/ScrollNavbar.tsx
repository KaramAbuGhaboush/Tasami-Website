'use client'

import { useState, useEffect } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'

export default function ScrollNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('common')

  // Get current locale from URL as fallback
  const [currentLocale, setCurrentLocale] = useState<string>('en')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localeFromUrl = window.location.pathname.split('/')[1]
      if (localeFromUrl === 'en' || localeFromUrl === 'ar') {
        setCurrentLocale(localeFromUrl)
      } else {
        // Fallback to locale from useLocale hook if not in URL
        setCurrentLocale(locale as string)
      }
    }
  }, [locale, pathname])

  const navItems = [
    { name: t('home'), href: '/' },
    { name: t('services'), href: '/services' },
    { name: t('about'), href: '/about' },
    { name: t('work'), href: '/work' },
    { name: t('blog'), href: '/blog' },
    { name: t('career'), href: '/career' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLanguageSwitch = () => {
    const newLocale = currentLocale === 'en' ? 'ar' : 'en'

    // Get the actual current path from window.location.pathname
    let currentPath = ''
    if (typeof window !== 'undefined') {
      const fullPath = window.location.pathname
      
      // Extract path without locale prefix
      // Handle patterns like: /en/article/slug or /ar/article/slug
      const pathMatch = fullPath.match(/^\/(en|ar)(\/.*)?$/)
      
      if (pathMatch && pathMatch[2]) {
        // There's a path after the locale
        currentPath = pathMatch[2] // This gives us /article/slug
      } else {
        // Just locale with no path, or no locale at all
        currentPath = '/'
      }
    } else {
      // Fallback to pathname from hook (should already exclude locale)
      currentPath = pathname || '/'
    }
    
    // Clean up: ensure it starts with / and is not just /en or /ar
    if (!currentPath || currentPath === '' || currentPath === '/en' || currentPath === '/ar') {
      currentPath = '/'
    } else if (!currentPath.startsWith('/')) {
      currentPath = '/' + currentPath
    }

    // Build the new URL with locale prefix
    // For root path: /ar or /en
    // For other paths: /ar/article/slug
    const newUrl = currentPath === '/' 
      ? `/${newLocale}`
      : `/${newLocale}${currentPath}`

    // Use window.location.href for navigation
    window.location.href = newUrl
  }

  // Show the language name that user will switch TO
  // If current is English, show Arabic button text (so user can switch TO Arabic)
  // If current is Arabic, show English button text (so user can switch TO English)
  const languageButtonText = currentLocale === 'en' ? 'العربية' : 'English'

  // Helper function to determine if a nav item is active
  const isActive = (href: string) => {
    // Normalize pathname - remove leading/trailing slashes and ensure it starts with /
    const normalizedPath = pathname || '/'
    
    // For home page, check if pathname is exactly '/' or empty
    if (href === '/') {
      return normalizedPath === '/' || normalizedPath === ''
    }
    
    // For other pages, check if pathname starts with the href
    return normalizedPath.startsWith(href)
  }

  return (
    <nav className={`glass-nav sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.png"
              alt="Tasami Logo"
              width={240}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link text-sm font-medium transition-all duration-300 ${isActive(item.href)
                  ? 'text-[#667eea] font-semibold active'
                  : 'text-gray-700 hover:text-[#667eea]'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Language Switcher and CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={handleLanguageSwitch}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-[#667eea] hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
              aria-label="Switch language"
            >
              {languageButtonText}
            </button>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="btn-primary rounded-full"
            >
              {t('getStarted')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#667eea] hover:bg-gray-100 transition-colors duration-200"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-card border-t border-white/20">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive(item.href)
                    ? 'text-[#667eea] bg-gray-50'
                    : 'text-gray-700 hover:text-[#667eea] hover:bg-gray-50'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Language Switcher and CTA */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={handleLanguageSwitch}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#667eea] hover:bg-gray-50 text-center border border-gray-200"
                >
                  {languageButtonText}
                </button>
                <Link
                  href="/contact"
                  className="block w-full btn-primary text-center rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('getStarted')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
