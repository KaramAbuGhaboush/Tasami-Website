'use client'

import { useState, useEffect } from 'react'

interface LightweightAnimationProps {
  type?: 'ecommerce' | 'automation' | 'design' | 'marketing' | 'qa' | 'support'
  className?: string
}

export default function LightweightAnimation({ 
  type = 'ecommerce', 
  className = '' 
}: LightweightAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.querySelector(`[data-animation="${type}"]`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [type])

  const animations = {
    ecommerce: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle 
          cx="100" 
          cy="100" 
          r="80" 
          fill="none" 
          stroke="url(#gradient1)" 
          strokeWidth="3"
          className={isVisible ? 'animate-spin' : ''}
          style={{ animationDuration: '3s' }}
        />
        <path 
          d="M60 100 L80 80 L100 100 L120 80 L140 100" 
          stroke="url(#gradient2)" 
          strokeWidth="2" 
          fill="none"
          className={isVisible ? 'animate-pulse' : ''}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6812F7" />
            <stop offset="100%" stopColor="#9253F0" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9253F0" />
            <stop offset="100%" stopColor="#DFC7FE" />
          </linearGradient>
        </defs>
      </svg>
    ),
    automation: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect 
          x="50" 
          y="50" 
          width="100" 
          height="100" 
          rx="10" 
          fill="none" 
          stroke="url(#gradient3)" 
          strokeWidth="3"
          className={isVisible ? 'animate-pulse' : ''}
        />
        <circle 
          cx="100" 
          cy="100" 
          r="30" 
          fill="url(#gradient4)" 
          className={isVisible ? 'animate-bounce' : ''}
        />
        <defs>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6812F7" />
            <stop offset="100%" stopColor="#9253F0" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9253F0" />
            <stop offset="100%" stopColor="#DFC7FE" />
          </linearGradient>
        </defs>
      </svg>
    ),
    design: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon 
          points="100,20 180,80 180,160 100,200 20,160 20,80" 
          fill="none" 
          stroke="url(#gradient5)" 
          strokeWidth="3"
          className={isVisible ? 'animate-spin' : ''}
          style={{ animationDuration: '4s' }}
        />
        <circle 
          cx="100" 
          cy="100" 
          r="40" 
          fill="url(#gradient6)" 
          className={isVisible ? 'animate-pulse' : ''}
        />
        <defs>
          <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6812F7" />
            <stop offset="100%" stopColor="#9253F0" />
          </linearGradient>
          <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9253F0" />
            <stop offset="100%" stopColor="#DFC7FE" />
          </linearGradient>
        </defs>
      </svg>
    ),
    marketing: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path 
          d="M50 100 Q100 50 150 100 Q100 150 50 100" 
          fill="none" 
          stroke="url(#gradient7)" 
          strokeWidth="3"
          className={isVisible ? 'animate-pulse' : ''}
        />
        <circle 
          cx="100" 
          cy="100" 
          r="20" 
          fill="url(#gradient8)" 
          className={isVisible ? 'animate-bounce' : ''}
        />
        <defs>
          <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6812F7" />
            <stop offset="100%" stopColor="#9253F0" />
          </linearGradient>
          <linearGradient id="gradient8" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9253F0" />
            <stop offset="100%" stopColor="#DFC7FE" />
          </linearGradient>
        </defs>
      </svg>
    ),
    qa: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect 
          x="60" 
          y="60" 
          width="80" 
          height="80" 
          rx="5" 
          fill="none" 
          stroke="url(#gradient9)" 
          strokeWidth="3"
          className={isVisible ? 'animate-pulse' : ''}
        />
        <path 
          d="M80 100 L90 110 L120 80" 
          stroke="url(#gradient10)" 
          strokeWidth="4" 
          fill="none"
          className={isVisible ? 'animate-bounce' : ''}
        />
        <defs>
          <linearGradient id="gradient9" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6812F7" />
            <stop offset="100%" stopColor="#9253F0" />
          </linearGradient>
          <linearGradient id="gradient10" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9253F0" />
            <stop offset="100%" stopColor="#DFC7FE" />
          </linearGradient>
        </defs>
      </svg>
    ),
    support: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle 
          cx="100" 
          cy="100" 
          r="70" 
          fill="none" 
          stroke="url(#gradient11)" 
          strokeWidth="3"
          className={isVisible ? 'animate-pulse' : ''}
        />
        <circle 
          cx="100" 
          cy="100" 
          r="40" 
          fill="url(#gradient12)" 
          className={isVisible ? 'animate-bounce' : ''}
        />
        <defs>
          <linearGradient id="gradient11" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6812F7" />
            <stop offset="100%" stopColor="#9253F0" />
          </linearGradient>
          <linearGradient id="gradient12" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9253F0" />
            <stop offset="100%" stopColor="#DFC7FE" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  return (
    <div 
      data-animation={type}
      className={`lightweight-animation ${className}`}
    >
      {animations[type]}
    </div>
  )
}
