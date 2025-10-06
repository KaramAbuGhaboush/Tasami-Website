'use client'

import Lottie from 'lottie-react'
import { useRef, useState, useEffect, useCallback } from 'react'

interface LottieAnimationProps {
  animationData?: any
  animationPath?: string
  className?: string
  loop?: boolean
  autoplay?: boolean
  speed?: number
  lazy?: boolean
  reducedMotion?: boolean
}

export default function LottieAnimation({ 
  animationData,
  animationPath,
  className = '', 
  loop = true, 
  autoplay = true, 
  speed = 1,
  lazy = true,
  reducedMotion = false
}: LottieAnimationProps) {
  const lottieRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [loadedAnimation, setLoadedAnimation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(!lazy)
  const [hasLoaded, setHasLoaded] = useState(false)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [lazy, hasLoaded])

  // Load animation data
  useEffect(() => {
    if (!isVisible || hasLoaded) return

    const loadAnimation = async () => {
      setLoading(true)
      
      try {
        if (animationPath) {
          const response = await fetch(animationPath)
          if (!response.ok) throw new Error('Failed to fetch animation')
          const data = await response.json()
          setLoadedAnimation(data)
        } else if (animationData) {
          setLoadedAnimation(animationData)
        }
        setHasLoaded(true)
      } catch (error) {
        console.error('Failed to load animation:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnimation()
  }, [isVisible, animationPath, animationData, hasLoaded])

  // Optimize animation based on user preferences
  useEffect(() => {
    if (!lottieRef.current || !loadedAnimation) return

    const animation = lottieRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || reducedMotion) {
      animation.setSpeed(0.5)
      animation.pause()
    } else {
      animation.setSpeed(speed)
    }
  }, [loadedAnimation, speed, reducedMotion])

  // Pause animation when not visible (performance optimization)
  useEffect(() => {
    if (!lottieRef.current) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lottieRef.current?.pause()
      } else if (autoplay) {
        lottieRef.current?.play()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [autoplay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lottieRef.current) {
        lottieRef.current.destroy()
      }
    }
  }, [])

  if (loading) {
    return (
      <div ref={containerRef} className={`lottie-container ${className} flex items-center justify-center`}>
        <div className="w-12 h-12 border-2 border-[#6812F7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!loadedAnimation) {
    return (
      <div ref={containerRef} className={`lottie-container ${className} flex items-center justify-center`}>
        <div className="w-12 h-12 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`lottie-container ${className}`}>
      <Lottie
        lottieRef={lottieRef}
        animationData={loadedAnimation}
        loop={loop}
        autoplay={autoplay}
        style={{ 
          width: '100%', 
          height: '100%',
          maxWidth: '400px', // Limit size for performance
          maxHeight: '400px'
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
          progressiveLoad: true,
          hideOnTransparent: true
        }}
      />
    </div>
  )
}
