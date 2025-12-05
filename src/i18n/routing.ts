// Routing configuration - no longer using locale in URL
// Language is now managed via sessionStorage and LanguageContext

export const locales = ['en', 'ar'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

// Re-export Next.js navigation hooks for compatibility
// Components should use next/navigation directly instead
export { Link, redirect, usePathname, useRouter } from 'next/navigation';

