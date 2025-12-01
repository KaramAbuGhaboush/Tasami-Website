'use client'

import { useEffect } from 'react'

export default function PerformanceToggle() {
  useEffect(() => {
    // Automatically detect device capability and set performance mode
    const detectPerformanceMode = () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      // Check connection speed
      const connection = (navigator as any).connection
      const isSlowConnection = connection && 
        (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      
      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory
      const isLowMemory = deviceMemory && deviceMemory < 4
      
      // Check hardware concurrency (CPU cores)
      const cpuCores = navigator.hardwareConcurrency
      const isLowCPU = cpuCores && cpuCores < 4
      
      // Check if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // Determine if we should use lightweight mode
      const useLightweight = prefersReducedMotion || isSlowConnection || isLowMemory || (isMobile && isLowCPU)
      
      // Apply to document for global access
      if (useLightweight) {
        document.documentElement.setAttribute('data-performance-mode', 'lightweight')
      } else {
        document.documentElement.setAttribute('data-performance-mode', 'full')
      }
      
      // Apply to all Lottie elements
      const lottieElements = document.querySelectorAll('[data-lottie-animation]')
      lottieElements.forEach(element => {
        if (useLightweight) {
          element.setAttribute('data-use-lightweight', 'true')
        } else {
          element.removeAttribute('data-use-lightweight')
        }
      })
    }

    detectPerformanceMode()
    
    // Re-check if connection changes
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', detectPerformanceMode)
      return () => connection.removeEventListener('change', detectPerformanceMode)
    }
  }, [])

  // No UI - fully automatic
  return null
}
