'use client'

import { usePathname } from 'next/navigation'
import ScrollNavbar from './ScrollNavbar'
import Footer from './Footer'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Don't show navbar on admin and employee pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/employee') || pathname.startsWith('/login')) {
    return null
  }
  
  return <ScrollNavbar />
}

export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Don't show footer on admin and employee pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/employee') || pathname.startsWith('/login')) {
    return null
  }
  
  return <Footer />
}
