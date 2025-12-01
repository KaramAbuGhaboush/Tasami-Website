'use client'

import { Link } from '@/i18n/routing'
import { Job } from '@/hooks/useCareer'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { SkeletonJobListing, SkeletonShimmer, SkeletonText } from '@/components/ui/skeleton'

interface CareerProps {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  handleRetry: () => void;
}

export function Career({
  jobs,
  loading,
  error,
  handleRetry
}: CareerProps) {
  const t = useTranslations('career')
  const locale = useLocale()
  const isRTL = locale === 'ar'
  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="relative -mt-20 pt-20 pb-16 flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8F4FF] via-white to-[#E8E0FF]"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full">
            <div className="text-center space-y-8">
              <SkeletonShimmer className="h-8 w-48 mx-auto rounded-full" />
              <SkeletonShimmer className="h-16 w-3/4 mx-auto rounded" />
              <SkeletonShimmer className="h-8 w-2/3 mx-auto rounded" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center space-y-2">
                    <SkeletonShimmer className="h-10 w-20 mx-auto rounded" />
                    <SkeletonShimmer className="h-4 w-24 mx-auto rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Company Culture Skeleton */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <SkeletonShimmer className="h-10 w-64 rounded" />
                <SkeletonText lines={3} />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <SkeletonShimmer className="h-6 w-6 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <SkeletonShimmer className="h-5 w-48 rounded" />
                        <SkeletonShimmer className="h-4 w-full rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <SkeletonShimmer className="h-96 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Job Openings Skeleton */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <SkeletonShimmer className="h-10 w-64 mx-auto rounded" />
              <SkeletonShimmer className="h-6 w-96 mx-auto rounded" />
            </div>
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonJobListing key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('errorLoadingJobs')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-[#6812F7] text-white px-6 py-3 rounded-lg hover:bg-[#9253F0] transition-colors"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  const jobOpenings = jobs;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative -mt-20 pt-20 pb-16 flex items-center overflow-hidden">
        {/* Background Elements */}
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

          {/* Floating Elements */}
          <div className="hidden sm:block absolute top-20 left-20 w-2 h-2 bg-[#6812F7]/20 rounded-full float-gentle"></div>
          <div className="hidden sm:block absolute top-40 right-32 w-1 h-1 bg-[#9253F0]/30 rounded-full float-gentle" style={{ animationDelay: '1s' }}></div>
          <div className="hidden sm:block absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#DFC7FE]/25 rounded-full float-gentle" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center">
            {/* Trust Badge */}
            <div className={`inline-flex items-center px-4 py-2 bg-[#6812F7]/10 rounded-full text-[#6812F7] text-sm font-medium mb-6 ${isRTL ? 'flex-row' : ''}`}>
              <span className={`w-2 h-2 bg-[#6812F7] rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></span>
              {t('joinProfessionals')}
            </div>

            {/* Main Heading */}
            <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[0.9] mb-8 ${isRTL ? 'text-center' : ''}`}>
              {t('buildTheFuture')}
              <span className="block gradient-text mt-2">
                {t('withUs')}
              </span>
            </h1>

            {/* Subheading */}
            <p className={`text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-12 ${isRTL ? 'text-center' : ''}`}>
              {t('subheading')}
            </p>


{/* Stats - Hidden
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#6812F7] mb-2">50+</div>
                <div className="text-gray-600">{t('teamMembers')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#9253F0] mb-2">15+</div>
                <div className="text-gray-600">{t('countries')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#6812F7] mb-2">95%</div>
                <div className="text-gray-600">{t('retentionRate')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#9253F0] mb-2">4.8/5</div>
                <div className="text-gray-600">{t('satisfaction')}</div>
              </div>
            </div>
            */}
          </div>
        </div>
      </section>


{/* Company Culture & Numbers - Hidden
      <section className={`py-20 bg-gray-50 ${isRTL ? 'text-right' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col lg:flex-row gap-12 items-center ${isRTL ? 'lg:flex-row' : ''}`}>
            <div className="flex-1">
              <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : ''}`}>
                {t('ourCulture')}
              </h2>
              <p className={`text-lg text-gray-600 mb-6 ${isRTL ? 'text-right' : ''}`}>
                {t('cultureDescription')}
              </p>
              <div className="space-y-4">
                <div className={`flex items-start ${isRTL ? 'flex-row' : ''}`}>
                  <div className={`w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="font-semibold text-gray-900">{t('collaborativeEnvironment')}</h3>
                    <p className="text-gray-600">{t('collaborativeEnvironmentDescription')}</p>
                  </div>
                </div>
                <div className={`flex items-start ${isRTL ? 'flex-row' : ''}`}>
                  <div className={`w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="font-semibold text-gray-900">{t('innovationFocus')}</h3>
                    <p className="text-gray-600">{t('innovationFocusDescription')}</p>
                  </div>
                </div>
                <div className={`flex items-start ${isRTL ? 'flex-row' : ''}`}>
                  <div className={`w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="font-semibold text-gray-900">{t('workLifeBalance')}</h3>
                    <p className="text-gray-600">{t('workLifeBalanceDescription')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="text-6xl mb-6">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('joinGrowingTeam')}</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <div className="text-gray-600">{t('teamMembers')}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">15+</div>
                    <div className="text-gray-600">{t('countries')}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-gray-600">{t('retentionRate')}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">4.8/5</div>
                    <div className="text-gray-600">{t('teamSatisfaction')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Job Openings */}
      <section className={`py-20 bg-white ${isRTL ? 'text-right' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-16 ${isRTL ? 'text-right' : 'text-center'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-center' : ''}`}>
              {t('openPositions')}
            </h2>
            <p className={`text-xl text-gray-600 max-w-2xl mx-auto ${isRTL ? 'text-center' : ''}`}>
              {t('openPositionsDescription')}
            </p>
          </div>

          <div className="space-y-8">
            {jobOpenings.map((job, index) => (
              <div key={index} className={`bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 ${isRTL ? 'lg:flex-row' : ''}`}>
                  <div>
                    <h3 className={`text-2xl font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : ''}`}>{job.title}</h3>
                    <div className={`flex flex-wrap gap-4 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <span className={`flex items-center ${isRTL ? 'flex-row' : ''}`}>
                        <svg className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className={`flex items-center ${isRTL ? 'flex-row' : ''}`}>
                        <svg className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.type}
                      </span>
                      <span className={`flex items-center ${isRTL ? 'flex-row' : ''}`}>
                        <svg className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        {job.experience}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                      {job.department}
                    </span>
                  </div>
                </div>

                <p className={`text-gray-600 mb-6 ${isRTL ? 'text-right' : ''}`}>{job.description}</p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className={isRTL ? 'text-right' : ''}>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('requirements')}</h4>
                    <ul className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className={`flex items-start text-sm text-gray-600 ${isRTL ? 'flex-row' : ''}`}>
                          <svg className={`w-4 h-4 text-green-500 mt-0.5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('benefits')}</h4>
                    <ul className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
                      {job.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className={`flex items-start text-sm text-gray-600 ${isRTL ? 'flex-row' : ''}`}>
                          <svg className={`w-4 h-4 text-blue-500 mt-0.5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`mt-6 flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row' : ''}`}>
                  <a
                    href={`mailto:admin@tasami.co?subject=Application for ${encodeURIComponent(job.title)} position`}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 text-center"
                  >
                    {t('applyNow')}
                  </a>
                  <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                    {t('learnMore')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isRTL ? 'text-right' : 'text-center'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-white mb-6 ${isRTL ? 'text-center' : ''}`}>
            {t('dontSeeYourRole')}
          </h2>
          <p className={`text-xl text-blue-100 mb-8 max-w-2xl mx-auto ${isRTL ? 'text-right' : ''}`}>
            {t('ctaDescription')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {t('sendResume')}
            </button>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              {t('contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
