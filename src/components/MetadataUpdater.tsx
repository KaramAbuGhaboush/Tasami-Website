'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { generateOrganizationStructuredData } from '@/lib/structured-data'

export function MetadataUpdater() {
  const { locale, direction } = useLanguage()

  useEffect(() => {
    // Update HTML attributes
    document.documentElement.setAttribute('lang', locale)
    document.documentElement.setAttribute('dir', direction)

    // Update or create structured data script
    const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN 
      ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
      : 'https://www.tasami.co'
    
    const organizationStructuredData = generateOrganizationStructuredData(baseUrl)
    
    // Remove existing structured data script if any
    const existingScript = document.getElementById('organization-structured-data')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data script
    const script = document.createElement('script')
    script.id = 'organization-structured-data'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(organizationStructuredData)
    document.head.appendChild(script)

    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        if (isProperty) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const isArabic = locale === 'ar'
    
    // Update title
    const title = isArabic 
      ? "تاسامي - حلول الذكاء الاصطناعي والأتمتة والتصميم والتسويق"
      : "Tasami - AI, Automation, Design & Marketing Solutions"
    
    document.title = title

    // Update description
    const description = isArabic
      ? "شركة تقنية رائدة متخصصة في الذكاء الاصطناعي والأتمتة والتصميم وواجهات المستخدم وحلول التسويق. حول عملك بتقنيات متطورة."
      : "Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions. Transform your business with cutting-edge technology."

    updateMetaTag('description', description)
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:locale', isArabic ? 'ar_SA' : 'en_US', true)
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)

    return () => {
      // Cleanup
      const scriptToRemove = document.getElementById('organization-structured-data')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [locale, direction])

  return null
}

