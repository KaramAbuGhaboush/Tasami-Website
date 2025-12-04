'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState, ReactNode, useMemo } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import ConditionalNavbar, { ConditionalFooter } from '@/components/ConditionalNavbar'
import enMessages from '../messages/en.json'
import arMessages from '../messages/ar.json'

interface IntlProviderProps {
  children: ReactNode
}

// Message map for static imports (Turbopack-friendly)
const messagesMap = {
  en: enMessages,
  ar: arMessages,
} as const

export function IntlProvider({ children }: IntlProviderProps) {
  const { locale } = useLanguage()
  
  // Get messages synchronously from the map
  const messages = useMemo(() => {
    return messagesMap[locale] || messagesMap.en
  }, [locale])

  return (
    <ErrorBoundary>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ConditionalNavbar />
        {children}
        <ConditionalFooter />
      </NextIntlClientProvider>
    </ErrorBoundary>
  )
}

