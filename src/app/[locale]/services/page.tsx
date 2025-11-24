import { Services } from '@/components/Services'
import { getServicesData } from '@/lib/services-data'

export default async function ServicesPage() {
    const {
        services,
        processSteps
    } = getServicesData()

    return (
        <Services
            services={services}
            processSteps={processSteps}
        />
    )
}

export async function generateStaticParams() {
    return [
        { locale: 'en' },
        { locale: 'ar' }
    ]
}

