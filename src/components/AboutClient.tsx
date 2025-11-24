'use client'

import { useState } from 'react'
import { About } from './About'
import { Value, FAQ } from '@/lib/about-data'

interface AboutClientProps {
  values: Value[];
  faqs: FAQ[];
}

export function AboutClient({ values, faqs }: AboutClientProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  return (
    <About
      values={values}
      faqs={faqs}
      openFAQ={openFAQ}
      setOpenFAQ={setOpenFAQ}
    />
  )
}

