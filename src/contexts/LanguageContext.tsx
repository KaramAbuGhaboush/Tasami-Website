'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

type Locale = 'en' | 'ar'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  direction: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'tasami-locale'
const DEFAULT_LOCALE: Locale = 'en'

/**
 * Get language from sessionStorage or return default
 */
function getStoredLanguage(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ar') {
      return stored
    }
  } catch (error) {
    console.error('Error reading from sessionStorage:', error)
  }

  return DEFAULT_LOCALE
}

/**
 * Save language to sessionStorage
 */
function saveLanguage(locale: Locale): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, locale)
  } catch (error) {
    console.error('Error saving to sessionStorage:', error)
  }
}

/**
 * Update HTML attributes based on locale
 */
function updateHtmlAttributes(locale: Locale): void {
  if (typeof document === 'undefined') {
    return
  }

  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('lang', locale)
  document.documentElement.setAttribute('dir', direction)
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize language from sessionStorage on mount
  useEffect(() => {
    const storedLocale = getStoredLanguage()
    setLocaleState(storedLocale)
    updateHtmlAttributes(storedLocale)
    setIsInitialized(true)
  }, [])

  // Update HTML attributes when locale changes
  useEffect(() => {
    if (isInitialized) {
      updateHtmlAttributes(locale)
    }
  }, [locale, isInitialized])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    saveLanguage(newLocale)
    updateHtmlAttributes(newLocale)
  }, [])

  const direction = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ locale, setLocale, direction }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

