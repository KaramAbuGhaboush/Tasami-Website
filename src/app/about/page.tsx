'use client'

import { AboutClient } from '@/components/AboutClient'
import { getAboutData } from '@/lib/about-data'

export default function AboutPage() {
    const { values, faqs } = getAboutData()

    return <AboutClient values={values} faqs={faqs} />
}

