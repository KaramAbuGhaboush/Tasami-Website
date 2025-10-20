'use client'

import { useContact } from '@/hooks/useContact'
import { Contact } from '@/components/Contact'

export default function ContactPage() {
  const {
    formData,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
    resetForm,
    contactInfo,
    projectTypes,
    budgetRanges
  } = useContact()

  return (
    <Contact
      formData={formData}
      isSubmitting={isSubmitting}
      isSubmitted={isSubmitted}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      resetForm={resetForm}
      contactInfo={contactInfo}
      projectTypes={projectTypes}
      budgetRanges={budgetRanges}
    />
  )
}