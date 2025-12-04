'use client'

import { Home } from '@/components/Home'
import { getHomeServices } from '@/lib/home-data'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMemo } from 'react'

export default function HomePage() {
  const { locale } = useLanguage()
  const services = useMemo(() => getHomeServices(locale), [locale])

  return <Home services={services} />
}
