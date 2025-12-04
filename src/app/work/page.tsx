'use client'

import { useWork } from '@/hooks/useWork'
import { Work } from '@/components/Work'

export default function WorkPage() {
    const {
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
    } = useWork()

    return (
        <Work
            projects={projects}
            loading={loading}
            error={error}
            categories={categories}
            testimonials={testimonials}
            testimonialsLoading={testimonialsLoading}
            testimonialsError={testimonialsError}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            isAutoPlaying={isAutoPlaying}
            setIsAutoPlaying={setIsAutoPlaying}
            touchStart={touchStart}
            setTouchStart={setTouchStart}
            touchEnd={touchEnd}
            setTouchEnd={setTouchEnd}
            goToSlide={goToSlide}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
            resumeAutoPlay={resumeAutoPlay}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
        />
    )
}

