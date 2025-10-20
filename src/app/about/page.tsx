'use client'

import { useAbout } from '@/hooks/useAbout'
import { About } from '@/components/About'

export default function AboutPage() {
  const {
    values,
    faqs,
    openFAQ,
    setOpenFAQ
  } = useAbout()

  return (
    <About
      values={values}
      faqs={faqs}
      openFAQ={openFAQ}
      setOpenFAQ={setOpenFAQ}
    />
  )
}
