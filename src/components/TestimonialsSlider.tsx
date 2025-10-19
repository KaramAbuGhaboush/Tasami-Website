import { Testimonial } from '@/hooks/useWorkData';
import { useTestimonialsSlider } from '@/hooks/useTestimonialsSlider';

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
}

export const TestimonialsSlider = ({ testimonials }: TestimonialsSliderProps) => {
  const {
    currentSlide,
    isAutoPlaying,
    goToSlide,
    goToPrevious,
    goToNext,
    resumeAutoPlay,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useTestimonialsSlider(testimonials.length);

  if (testimonials.length === 0) return null;

  return (
    <div className="relative">
      {/* Testimonials Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
                {/* Quote */}
                <div className="text-center mb-8">
                  <svg className="w-12 h-12 md:w-16 md:h-16 text-[#667eea] mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                  <blockquote className="text-lg md:text-xl lg:text-2xl text-gray-800 font-medium leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                </div>

                {/* Star rating */}
                <div className="flex justify-center mb-6 md:mb-8">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-current mx-1" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  ))}
                </div>

                {/* Client Info */}
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-4">
                    {testimonial.initials}
                  </div>
                  <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={resumeAutoPlay}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-[#667eea] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={resumeAutoPlay}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-[#667eea] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-12 md:mt-16 space-x-3">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={resumeAutoPlay}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[#667eea] scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
