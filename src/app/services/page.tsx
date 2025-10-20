import { useServices } from '@/hooks/useServices'
import { Services } from '@/components/Services'

export default function ServicesPage() {
  const {
    services,
    processSteps,
    getColorClasses
  } = useServices()

  return (
    <Services
      services={services}
      processSteps={processSteps}
      getColorClasses={getColorClasses}
    />
  )
}
