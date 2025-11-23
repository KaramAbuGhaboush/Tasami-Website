import { Home } from '@/components/Home'
import { getHomeServices } from '@/lib/home-data'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const services = getHomeServices(locale)

    return <Home services={services} />
}

export async function generateStaticParams() {
    return [
        { locale: 'en' },
        { locale: 'ar' }
    ]
}

