import Link from 'next/link'
import LottieAnimation from '@/components/LottieAnimation'
import LightweightAnimation from '@/components/LightweightAnimation'
import PerformanceToggle from '@/components/PerformanceToggle'
import { ServiceInfo } from '@/hooks/useHome'

interface HomeProps {
  services: ServiceInfo[];
}

export function Home({ services }: HomeProps) {
  return (
    <div className="min-h-screen">
      {/* Unique Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Grid and Gradient Background */}
        <div className="absolute inset-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8F4FF] via-white to-[#E8E0FF]"></div>
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-30 grid-pattern"
            style={{
              backgroundImage: `
                linear-gradient(rgba(104, 18, 247, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(104, 18, 247, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          ></div>
          
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/20"></div>
          
          {/* Floating Elements - Hidden on mobile */}
          <div className="hidden sm:block absolute top-20 left-20 w-2 h-2 bg-[#6812F7]/20 rounded-full float-gentle"></div>
          <div className="hidden sm:block absolute top-40 right-32 w-1 h-1 bg-[#9253F0]/30 rounded-full float-gentle" style={{ animationDelay: '1s' }}></div>
          <div className="hidden sm:block absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#DFC7FE]/25 rounded-full float-gentle" style={{ animationDelay: '2s' }}></div>
          <div className="hidden sm:block absolute bottom-20 right-20 w-1 h-1 bg-[#6812F7]/20 rounded-full float-gentle" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-[#6812F7]/10 rounded-full text-[#6812F7] text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <span className="w-2 h-2 bg-[#6812F7] rounded-full mr-2"></span>
                Trusted by 500+ Companies
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-[0.9]">
                Transform Your
                <span className="block gradient-text mt-1 sm:mt-2">
                  Business
                </span>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-600 font-light mt-2 sm:mt-4">
                  with AI & Automation
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                We help companies leverage cutting-edge technology to streamline operations, 
                enhance user experiences, and drive growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link href="/contact" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  Start Your Project
                </Link>
                <Link href="/work" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  View Our Work
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-8">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">500+</div>
                  <div className="text-xs sm:text-sm text-gray-500">Projects</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">98%</div>
                  <div className="text-xs sm:text-sm text-gray-500">Success Rate</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">5+</div>
                  <div className="text-xs sm:text-sm text-gray-500">Years</div>
                </div>
              </div>
            </div>

            {/* Right Content - Enhanced Premium Visual */}
            <div className="relative hidden lg:block">
              {/* Background Decorative Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Enhanced radial gradient spotlight */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-[#6812F7]/15 via-[#9253F0]/8 to-transparent rounded-full blur-3xl"></div>
                
                {/* Abstract decorative shapes - circles and blobs */}
                <div className="absolute top-8 right-12 w-3 h-3 bg-[#6812F7]/20 rounded-full float-gentle"></div>
                <div className="absolute top-1/3 left-8 w-2 h-2 bg-[#9253F0]/30 rounded-full float-gentle" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 right-16 w-4 h-4 bg-[#DFC7FE]/25 rounded-full float-gentle" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-8 left-12 w-2 h-2 bg-[#6812F7]/15 rounded-full float-gentle" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-2/3 right-8 w-3 h-3 bg-[#9253F0]/20 rounded-full float-gentle" style={{ animationDelay: '1.5s' }}></div>
                
                {/* Additional decorative elements */}
                <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-gradient-to-br from-[#6812F7]/10 to-[#9253F0]/15 rounded-full blur-sm float-gentle" style={{ animationDelay: '0.8s' }}></div>
                <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-gradient-to-br from-[#DFC7FE]/15 to-[#6812F7]/20 rounded-full blur-sm float-gentle" style={{ animationDelay: '2.2s' }}></div>
                <div className="absolute top-3/4 left-1/3 w-4 h-4 bg-gradient-to-br from-[#9253F0]/12 to-[#DFC7FE]/18 rounded-full blur-sm float-gentle" style={{ animationDelay: '1.8s' }}></div>
                
                {/* Floating particles/sparkles */}
                <div className="absolute top-12 right-20 w-1 h-1 bg-[#6812F7]/40 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-1/2 left-16 w-1 h-1 bg-[#9253F0]/50 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
                <div className="absolute bottom-20 right-24 w-1 h-1 bg-[#DFC7FE]/45 rounded-full animate-pulse" style={{ animationDelay: '2.1s' }}></div>
                <div className="absolute top-2/3 left-20 w-1 h-1 bg-[#6812F7]/35 rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></div>
              </div>
              
              <div className="relative w-full h-[600px] lg:h-[700px]">
                {/* AI Solutions Card - Top Right */}
                <div className="absolute top-8 right-8 w-80 h-52 luxury-card rounded-3xl p-6 transform rotate-3 hover:rotate-0 transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl animate-float-1 group backdrop-blur-sm border border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6812F7]/8 to-[#9253F0]/12 rounded-3xl transition-all duration-500 group-hover:from-[#6812F7]/12 group-hover:to-[#9253F0]/16"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6812F7] via-[#9253F0] to-[#E879F9] rounded-2xl flex items-center justify-center mb-4 shadow-2xl animate-pulse-glow">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#6812F7] transition-colors duration-300">AI Solutions</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Intelligent automation for your business</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6812F7]/15 to-[#9253F0]/25 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* UX/UI Design Card - Center (Larger and more forward) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-88 h-56 luxury-card rounded-3xl p-6 transform -rotate-2 hover:rotate-0 transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl animate-float-2 group backdrop-blur-sm border border-white/20 z-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9253F0]/8 to-[#DFC7FE]/12 rounded-3xl transition-all duration-500 group-hover:from-[#9253F0]/12 group-hover:to-[#DFC7FE]/16"></div>
                  <div className="relative z-10">
                    <div className="w-22 h-22 bg-gradient-to-br from-[#9253F0] via-[#DFC7FE] to-[#A855F7] rounded-2xl flex items-center justify-center mb-4 shadow-2xl animate-pulse-glow">
                      <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#9253F0] transition-colors duration-300">UX/UI Design</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Beautiful user experiences</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9253F0]/15 to-[#DFC7FE]/25 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Marketing Card - Bottom Left */}
                <div className="absolute bottom-8 left-8 w-80 h-52 luxury-card rounded-3xl p-6 transform rotate-4 hover:rotate-0 transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl animate-float-3 group backdrop-blur-sm border border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#DFC7FE]/8 to-[#6812F7]/12 rounded-3xl transition-all duration-500 group-hover:from-[#DFC7FE]/12 group-hover:to-[#6812F7]/16"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#DFC7FE] via-[#6812F7] to-[#8B5CF6] rounded-2xl flex items-center justify-center mb-4 shadow-2xl animate-pulse-glow">
                      <svg className="w-10 h-10 text-white group-hover:text-[#4C1D95] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#4C1D95] transition-colors duration-300">Marketing</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Data-driven strategies</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#DFC7FE]/15 to-[#6812F7]/25 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            {/* Mobile Cards - Stacked Layout */}
            <div className="lg:hidden space-y-6 mt-8">
              {/* AI Solutions Card - Mobile */}
              <div className="w-full max-w-sm mx-auto luxury-card rounded-3xl p-6 transform hover:scale-105 transition-all duration-700 hover:shadow-2xl animate-float-1 group backdrop-blur-sm border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6812F7]/8 to-[#9253F0]/12 rounded-3xl transition-all duration-500 group-hover:from-[#6812F7]/12 group-hover:to-[#9253F0]/16"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6812F7] via-[#9253F0] to-[#E879F9] rounded-2xl flex items-center justify-center mb-4 shadow-2xl animate-pulse-glow mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#6812F7] transition-colors duration-300 text-center">AI Solutions</h3>
                  <p className="text-sm text-gray-600 leading-relaxed text-center">Intelligent automation for your business</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#6812F7]/15 to-[#9253F0]/25 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
              {/* UX/UI Design Card - Mobile */}
              <div className="w-full max-w-sm mx-auto luxury-card rounded-3xl p-6 transform hover:scale-105 transition-all duration-700 hover:shadow-2xl animate-float-2 group backdrop-blur-sm border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9253F0]/8 to-[#DFC7FE]/12 rounded-3xl transition-all duration-500 group-hover:from-[#9253F0]/12 group-hover:to-[#DFC7FE]/16"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#9253F0] via-[#DFC7FE] to-[#A855F7] rounded-2xl flex items-center justify-center mb-4 shadow-2xl animate-pulse-glow mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#9253F0] transition-colors duration-300 text-center">UX/UI Design</h3>
                  <p className="text-sm text-gray-600 leading-relaxed text-center">Beautiful user experiences</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#9253F0]/15 to-[#DFC7FE]/25 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
              {/* Marketing Card - Mobile */}
              <div className="w-full max-w-sm mx-auto luxury-card rounded-3xl p-6 transform hover:scale-105 transition-all duration-700 hover:shadow-2xl animate-float-3 group backdrop-blur-sm border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#DFC7FE]/8 to-[#6812F7]/12 rounded-3xl transition-all duration-500 group-hover:from-[#DFC7FE]/12 group-hover:to-[#6812F7]/16"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#DFC7FE] via-[#6812F7] to-[#8B5CF6] rounded-2xl flex items-center justify-center mb-4 shadow-2xl animate-pulse-glow mx-auto">
                    <svg className="w-8 h-8 text-white group-hover:text-[#4C1D95] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#4C1D95] transition-colors duration-300 text-center">Marketing</h3>
                  <p className="text-sm text-gray-600 leading-relaxed text-center">Data-driven strategies</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#DFC7FE]/15 to-[#6812F7]/25 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section with Lottie Animations */}
      <section className="py-32 relative bg-gradient-to-br from-[#F2F3FF]/30 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-[#6812F7]/10 rounded-full text-[#6812F7] text-sm font-medium mb-6">
              Our Services
            </div>
            <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive technology solutions to accelerate your digital transformation
            </p>
          </div>
          
          {/* Services Grid */}
          {services.map((service, index) => (
            <div key={service.id} className={`grid lg:grid-cols-2 gap-16 items-center mb-24 ${index === services.length - 1 ? '' : ''}`}>
              {service.order === 'left' ? (
                <>
                  <div className="relative lg:order-1">
                    <div className="w-full h-96 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        <LottieAnimation 
                          animationPath={service.animationPath}
                          className="w-full h-full"
                          lazy={true}
                          speed={0.8}
                          reducedMotion={false}
                        />
                        <LightweightAnimation 
                          type="ecommerce"
                          className="absolute inset-0 w-full h-full opacity-0 data-[use-lightweight=true]:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8 lg:order-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm text-[#6812F7] font-semibold">{String(index + 1).padStart(2, '0')}</span>
                        <h3 className="text-4xl font-bold text-gray-900">{service.title}</h3>
                      </div>
                    </div>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-[#6812F7] rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/services" className="inline-flex items-center text-[#6812F7] font-semibold hover:text-[#5a0fd4] transition-colors">
                      Learn More
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm text-[#6812F7] font-semibold">{String(index + 1).padStart(2, '0')}</span>
                        <h3 className="text-4xl font-bold text-gray-900">{service.title}</h3>
                      </div>
                    </div>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-[#6812F7] rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/services" className="inline-flex items-center text-[#6812F7] font-semibold hover:text-[#5a0fd4] transition-colors">
                      Learn More
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="w-full h-96 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        <LottieAnimation 
                          animationPath={service.animationPath}
                          className="w-full h-full"
                          lazy={true}
                          speed={0.8}
                          reducedMotion={false}
                        />
                        <LightweightAnimation 
                          type="ecommerce"
                          className="absolute inset-0 w-full h-full opacity-0 data-[use-lightweight=true]:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Unique CTA Section */}
      <section className="gradient-primary py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
            Let's discuss how our technology solutions can accelerate your growth and streamline your operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#6812F7] px-10 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
            >
              Start Your Project
            </Link>
            <Link
              href="/work"
              className="border-2 border-white text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white hover:text-[#6812F7] transition-all duration-300 transform hover:-translate-y-2"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
      
      {/* Performance Toggle */}
      <PerformanceToggle />
    </div>
  )
}
