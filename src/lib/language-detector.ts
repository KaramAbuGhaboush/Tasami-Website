/**
 * Language detector utility
 * Reads language from sessionStorage and falls back to default
 */

export type Locale = 'en' | 'ar'

const STORAGE_KEY = 'tasami-locale'
const DEFAULT_LOCALE: Locale = 'en'

/**
 * Get the current language from sessionStorage
 * Falls back to default locale if not found or invalid
 */
export function getLanguage(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ar') {
      return stored
    }
  } catch (error) {
    console.error('Error reading language from sessionStorage:', error)
  }

  return DEFAULT_LOCALE
}

/**
 * Get text direction based on locale
 */
export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

