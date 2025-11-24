'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ScrollNavbar from './ScrollNavbar'
import Footer from './Footer'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  const [is404Page, setIs404Page] = useState(false)
  
  useEffect(() => {
    // Check if we're on a 404 page
    const check404 = () => {
      if (typeof document !== 'undefined') {
        const is404 = document.body?.getAttribute('data-page') === 'not-found' || 
                      document.querySelector('.not-found-page') !== null
        setIs404Page(is404)
      }
    }
    
    // Check immediately
    check404()
    
    // Also watch for changes
    const observer = new MutationObserver(check404)
    if (document.body) {
      observer.observe(document.body, { attributes: true, attributeFilter: ['data-page'] })
    }
    
    // Check periodically to catch cases where the attribute is set after initial render
    const interval = setInterval(check404, 100)
    
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])
  
  // Don't show navbar on admin, employee, login pages, or 404 pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/employee') || pathname.startsWith('/login') || is404Page) {
    return null
  }
  
  return <ScrollNavbar />
}

export function ConditionalFooter() {
  const pathname = usePathname()
  const [is404Page, setIs404Page] = useState(false)
  
  useEffect(() => {
    // Check if we're on a 404 page
    const check404 = () => {
      if (typeof document !== 'undefined') {
        const is404 = document.body?.getAttribute('data-page') === 'not-found' || 
                      document.querySelector('.not-found-page') !== null
        setIs404Page(is404)
      }
    }
    
    // Check immediately
    check404()
    
    // Also watch for changes
    const observer = new MutationObserver(check404)
    if (document.body) {
      observer.observe(document.body, { attributes: true, attributeFilter: ['data-page'] })
    }
    
    // Check periodically to catch cases where the attribute is set after initial render
    const interval = setInterval(check404, 100)
    
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])
  
  // Don't show footer on admin, employee, login pages, or 404 pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/employee') || pathname.startsWith('/login') || is404Page) {
    return null
  }
  
  return <Footer />
}
