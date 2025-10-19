'use client'

import { useCareer } from '@/hooks/useCareer'
import { Career } from '@/components/Career'

export default function CareerPage() {
  const {
    jobs,
    loading,
    error,
    handleRetry
  } = useCareer()

  return (
    <Career
      jobs={jobs}
      loading={loading}
      error={error}
      handleRetry={handleRetry}
    />
  )
}
