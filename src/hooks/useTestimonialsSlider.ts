import { useState, useEffect } from 'react';

export const useTestimonialsSlider = (testimonialsLength: number) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonialsLength === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonialsLength);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonialsLength]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Pause auto-play when manually navigating
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonialsLength);
    setIsAutoPlaying(false);
  };

  const resumeAutoPlay = () => {
    setIsAutoPlaying(true);
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && testimonialsLength > 0) {
      goToNext();
    }
    if (isRightSwipe && testimonialsLength > 0) {
      goToPrevious();
    }
  };

  return {
    currentSlide,
    isAutoPlaying,
    goToSlide,
    goToPrevious,
    goToNext,
    resumeAutoPlay,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
