import { useState, useEffect, useMemo } from 'react'
import { useProjects } from '@/hooks/useProjects'
import { useTestimonials } from '@/hooks/useTestimonials'
import { useTranslations } from 'next-intl'

export interface TransformedTestimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  quote: string;
  rating: number;
}

export interface UseWorkReturn {
  projects: any[];
  loading: boolean;
  error: string | null;
  categories: string[];
  testimonials: TransformedTestimonial[];
  testimonialsLoading: boolean;
  testimonialsError: string | null;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
  touchStart: number;
  setTouchStart: (start: number) => void;
  touchEnd: number;
  setTouchEnd: (end: number) => void;
  goToSlide: (index: number) => void;
  goToPrevious: () => void;
  goToNext: () => void;
  resumeAutoPlay: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export function useWork(): UseWorkReturn {
  const t = useTranslations('work')
  const { projects, loading, error } = useProjects()
  const { testimonials: apiTestimonials, loading: testimonialsLoading, error: testimonialsError } = useTestimonials()

  // Get unique categories from projects dynamically
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(projects.map(project => project.category).filter(Boolean)))
    // Filter out any "All" category that might already exist (to avoid duplicates)
    const filteredCategories = uniqueCategories.filter(cat => 
      cat !== 'All' && cat !== 'الكل' && cat !== t('all')
    )
    return [t('all'), ...filteredCategories]
  }, [projects, t])

  // Transform API testimonials to match the UI structure
  const testimonials: TransformedTestimonial[] = apiTestimonials.map(testimonial => ({
    id: testimonial.id,
    name: testimonial.clientName,
    role: testimonial.clientPosition,
    initials: testimonial.clientAvatar,
    quote: testimonial.content,
    rating: testimonial.rating
  }))

  // Testimonials slider state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false) // Pause auto-play when manually navigating
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const resumeAutoPlay = () => {
    setIsAutoPlaying(true)
  }

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  return {
    projects,
    loading,
    error,
    categories,
    testimonials,
    testimonialsLoading,
    testimonialsError,
    currentSlide,
    setCurrentSlide,
    isAutoPlaying,
    setIsAutoPlaying,
    touchStart,
    setTouchStart,
    touchEnd,
    setTouchEnd,
    goToSlide,
    goToPrevious,
    goToNext,
    resumeAutoPlay,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}
