import { useState } from 'react'
import { apiClient } from '../lib/api'

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  service: string;
  budget: string;
  message: string;
}

export interface ContactInfo {
  title: string;
  description: string;
  contact: string;
  icon: string;
  urgency: string;
}

export interface UseContactReturn {
  formData: ContactFormData;
  setFormData: (data: ContactFormData) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  contactInfo: ContactInfo[];
  projectTypes: string[];
  budgetRanges: string[];
}

export function useContact(): UseContactReturn {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    service: '',
    budget: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await apiClient.submitContactMessage({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        service: formData.service,
        budget: formData.budget,
        message: formData.message
      })

      if (response.success) {
        setIsSubmitted(true)
      } else {
        console.error('Form submission error:', response.message)
        // Note: This hook doesn't have access to useNotification, so we'll let the parent component handle errors
        // The parent component should handle error display
      }
    } catch (error) {
      console.error('Form submission error:', error)
      // Note: This hook doesn't have access to useNotification, so we'll let the parent component handle errors
      // The parent component should handle error display
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setFormData({
      name: '',
      company: '',
      email: '',
      service: '',
      budget: '',
      message: ''
    })
  }

  const contactInfo: ContactInfo[] = [
    {
      title: "Email Us",
      description: "Get a personalized response within 2 hours",
      contact: "hello@tasami.com",
      icon: "📧",
      urgency: "Fast Response"
    },
    {
      title: "WhatsApp",
      description: "Chat with us instantly",
      contact: "+1 (555) 123-4567",
      icon: "💬",
      urgency: "Instant Chat"
    },
    {
      title: "Schedule 30 mins meeting with our CEO",
      description: "Direct access to our CEO for strategic discussions",
      contact: "Book Meeting",
      icon: "👔",
      urgency: "CEO Access"
    }
  ]

  const projectTypes = [
    "Web Development",
    "Mobile App Development",
    "AI & Machine Learning",
    "Business Process Automation",
    "UX/UI Design",
    "Digital Marketing",
    "Data Analytics",
    "Cloud Solutions",
    "Other"
  ]

  const budgetRanges = [
    "Under $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000 - $100,000",
    "$100,000+",
    "Not sure yet"
  ]

  return {
    formData,
    setFormData,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
    resetForm,
    contactInfo,
    projectTypes,
    budgetRanges
  }
}
