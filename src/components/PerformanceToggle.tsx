'use client'

import { useState, useEffect } from 'react'
import { Settings, Zap, Battery } from 'lucide-react'

export default function PerformanceToggle() {
  const [isHighPerformance, setIsHighPerformance] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has slow connection or prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isSlowConnection = (navigator as any).connection && (navigator as any).connection.effectiveType === 'slow-2g'
    
    if (prefersReducedMotion || isSlowConnection) {
      setIsHighPerformance(true)
    }

    // Show toggle after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Apply performance setting to all Lottie animations
    const lottieElements = document.querySelectorAll('[data-lottie-animation]')
    lottieElements.forEach(element => {
      if (isHighPerformance) {
        element.setAttribute('data-use-lightweight', 'true')
      } else {
        element.removeAttribute('data-use-lightweight')
      }
    })
  }, [isHighPerformance])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isHighPerformance ? (
              <Battery className="w-4 h-4 text-green-600" />
            ) : (
              <Zap className="w-4 h-4 text-yellow-600" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {isHighPerformance ? 'High Performance' : 'Full Experience'}
            </span>
          </div>
          <button
            onClick={() => setIsHighPerformance(!isHighPerformance)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isHighPerformance ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isHighPerformance ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {isHighPerformance 
            ? 'Using lightweight animations for better performance' 
            : 'Using full Lottie animations for rich experience'
          }
        </p>
      </div>
    </div>
  )
}
