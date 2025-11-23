import { AboutClient } from '@/components/AboutClient'
import { getAboutData } from '@/lib/about-data'

export default async function AboutPage() {
    const { values, faqs } = getAboutData()

    return <AboutClient values={values} faqs={faqs} />
}

export async function generateStaticParams() {
    return [
        { locale: 'en' },
        { locale: 'ar' }
    ]
}

