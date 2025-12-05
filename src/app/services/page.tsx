'use client'

import { Services } from '@/components/Services'
import { getServicesData } from '@/lib/services-data'

export default function ServicesPage() {
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

