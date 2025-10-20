import Link from 'next/link'
import Image from 'next/image'
import { TransformedTestimonial } from '@/hooks/useWork'

interface WorkProps {
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

export function Work({
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
}: WorkProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8F4FF] via-white to-[#E8E0FF]"></div>
          <div 
            className="absolute inset-0 opacity-20 grid-pattern"
            style={{
              backgroundImage: `
                linear-gradient(rgba(104, 18, 247, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(104, 18, 247, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          ></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-[#6812F7]/30 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-[#9253F0]/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-[#DFC7FE]/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-20 w-2 h-2 bg-[#6812F7]/25 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-[#9253F0]/35 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#6812F7]/10 to-[#9253F0]/10 rounded-full text-[#6812F7] text-sm font-medium mb-8 border border-[#6812F7]/20 shadow-lg">
              <span className="w-2 h-2 bg-[#6812F7] rounded-full mr-3 animate-pulse"></span>
              Our Portfolio
            </div>
            
            {/* Enhanced Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[0.9] mb-8">
              Our
              <span className="block bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mt-2">
                Work
              </span>
            </h1>
            
            {/* Enhanced Description */}
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Discover how we've transformed businesses through 
              <span className="text-[#6812F7] font-semibold"> cutting-edge AI</span>, 
              <span className="text-[#9253F0] font-semibold"> automation</span>, and 
              <span className="text-[#6812F7] font-semibold"> design solutions</span>. 
              Each project tells a story of innovation, growth, and exceptional results.
            </p>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#6812F7] mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
                <div className="text-gray-600 font-medium">Projects</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#9253F0] mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-gray-600 font-medium">Success Rate</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#6812F7] mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-gray-600 font-medium">Client Satisfaction</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#9253F0] mb-2 group-hover:scale-110 transition-transform duration-300">∞</div>
                <div className="text-gray-600 font-medium">Innovation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className="px-8 py-4 rounded-full border-2 border-gray-200 text-gray-700 hover:border-[#667eea] hover:text-[#667eea] hover:bg-[#667eea]/5 transition-all duration-300 font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how we've helped businesses transform and achieve remarkable results
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
              <span className="ml-4 text-gray-600">Loading projects...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-red-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Projects</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project, index) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col">
                    {/* Project Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={project.image || "/api/placeholder/400/300"}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-[#667eea] px-3 py-1 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#667eea] transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-grow">
                        {project.description}
                      </p>
                      
                      {/* Key Results Preview */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {project.results.slice(0, 2).map((result, resultIndex) => (
                              <span key={resultIndex} className="bg-[#667eea]/10 text-[#667eea] px-3 py-1 rounded-full text-xs font-medium">
                                {result.description}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* View Project Link */}
                      <div className="flex items-center text-[#667eea] font-semibold group-hover:text-[#764ba2] transition-colors duration-300 mt-auto">
                        <span>View Project</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Projects State */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-20">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Found</h3>
              <p className="text-gray-500">We're working on adding more projects. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Project Success Metrics */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Project Success Metrics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our track record speaks for itself. These metrics represent the tangible impact we've delivered across all our projects.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center">
              <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-3">
                  500+
                </div>
                <div className="text-gray-600 font-medium text-lg">Projects Completed</div>
              </div>
            </div>

            <div className="group text-center">
              <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-3">
                  98%
                </div>
                <div className="text-gray-600 font-medium text-lg">On-Time Delivery</div>
              </div>
            </div>

            <div className="group text-center">
              <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-3">
                  95%
                </div>
                <div className="text-gray-600 font-medium text-lg">Client Retention</div>
              </div>
            </div>

            <div className="group text-center">
              <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-3">
                  4.9/5
                </div>
                <div className="text-gray-600 font-medium text-lg">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Clients Say */}
      <section className="py-24 bg-white overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what our clients have to say about working with us and the results we've delivered.
            </p>
          </div>

          {/* Testimonials Loading State */}
          {testimonialsLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
              <span className="ml-4 text-gray-600">Loading testimonials...</span>
            </div>
          )}

          {/* Testimonials Error State */}
          {testimonialsError && (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-red-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Testimonials</h3>
                <p className="text-red-600 mb-4">{testimonialsError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Testimonials Carousel */}
          {!testimonialsLoading && !testimonialsError && testimonials.length > 0 && (
            <div className="relative pb-16" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={resumeAutoPlay}>
            {/* Navigation Arrows - Hidden on Mobile */}
            <button 
              onClick={goToPrevious}
              className="hidden md:flex absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:shadow-xl transition-all duration-300 group"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-[#667eea] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={goToNext}
              className="hidden md:flex absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:shadow-xl transition-all duration-300 group"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-[#667eea] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Container */}
            <div 
              className="overflow-hidden min-h-[500px]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-gradient-to-br from-white to-gray-50 p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 relative overflow-visible text-center testimonial-card min-h-[400px] flex flex-col justify-center">
                        {/* Quote decoration */}
                        <div className="absolute top-8 right-8 text-6xl md:text-8xl text-[#667eea]/10 font-serif">"</div>
                        
                        {/* Star rating */}
                        <div className="flex justify-center mb-6 md:mb-8">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-current mx-1" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                            </svg>
                          ))}
                        </div>

                        <blockquote className="text-gray-700 mb-8 md:mb-10 text-lg md:text-2xl leading-relaxed italic max-w-3xl mx-auto">
                          "{testimonial.quote}"
                        </blockquote>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                            {testimonial.initials}
                          </div>
                          <div className="text-center sm:text-left">
                            <div className="font-bold text-gray-900 text-xl md:text-2xl">{testimonial.name}</div>
                            <div className="text-[#667eea] font-medium text-base md:text-lg">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-12 md:mt-16 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-[#667eea] w-8' 
                      : 'bg-gray-300 hover:bg-[#667eea]/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Auto-play indicator and mobile instructions */}
            <div className="flex flex-col items-center mt-4 space-y-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-sm text-gray-500 hover:text-[#667eea] transition-colors duration-300 flex items-center gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-[#667eea]' : 'bg-gray-400'}`}></div>
                {isAutoPlaying ? 'Auto-playing' : 'Paused'}
              </button>
              
              {/* Mobile swipe instruction */}
              <div className="md:hidden text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span>Swipe to navigate</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
          )}

          {/* No Testimonials State */}
          {!testimonialsLoading && !testimonialsError && testimonials.length === 0 && (
            <div className="text-center py-20">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Testimonials Available</h3>
              <p className="text-gray-500">We're working on adding client testimonials. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Ready to Start Your Project? */}
      <section className="relative py-32 bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#667eea] overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/5 rounded-full blur-lg"></div>
        </div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Start Your 
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Next Project?
              </span>
          </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let's discuss how we can help you achieve similar results for your business. 
              Our proven expertise and innovative solutions are ready to transform your ideas into reality.
            </p>

            {/* Stats preview */}
            <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-white/80 text-sm">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-white/80 text-sm">On-Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                <div className="text-white/80 text-sm">Rating</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/contact"
                className="group bg-white text-[#667eea] px-10 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 flex items-center"
            >
                <span>Start Your Project</span>
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>
              
            <Link
              href="/services"
                className="border-2 border-white/50 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
            >
                View Our Services
            </Link>
            </div>

            {/* Contact info */}
            <div className="mt-12 text-white/80">
              <p className="text-lg">
                Or call us directly at{' '}
                <a href="tel:+1234567890" className="text-white font-semibold hover:underline">
                  (123) 456-7890
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
