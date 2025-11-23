'use client'

import { Link } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { memo } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Value, FAQ } from '@/lib/about-data'

interface AboutProps {
  values: Value[];
  faqs: FAQ[];
  openFAQ: number | null;
  setOpenFAQ: (index: number | null) => void;
}

export const About = memo(function About({ values, faqs, openFAQ, setOpenFAQ }: AboutProps) {
  const t = useTranslations('about')
  const locale = useLocale()
  const isRTL = locale === 'ar'
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-20 pt-40">
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
              <span className={`w-2 h-2 bg-[#6812F7] rounded-full ${isRTL ? 'ml-3' : 'mr-3'} animate-pulse`}></span>
              {t('badgeText')}
            </div>

            {/* Enhanced Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[0.9] mb-8">
              {t('title')}
              <span className="block bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mt-2">
                {t('subtitle')}
              </span>
            </h1>

            {/* Enhanced Description */}
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              {t('description')}
              <span className="text-[#6812F7] font-semibold"> {t('descriptionHighlight1')}</span>,
              <span className="text-[#9253F0] font-semibold"> {t('descriptionHighlight2')}</span>,
              <span className="text-[#6812F7] font-semibold"> {t('descriptionHighlight3')}</span>{isRTL ? ' ' : ', '}{t('and')}
              <span className="text-[#9253F0] font-semibold"> {t('descriptionHighlight4')}</span>.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                href="/contact"
                className="group bg-gradient-to-r from-[#6812F7] to-[#9253F0] text-white px-10 py-5 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  {t('hero.cta1')}
                  <svg className={`w-5 h-5 ${isRTL ? 'mr-3' : 'ml-2'} group-hover:translate-x-1 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M7 16l-4-4m0 0l4-4m-4 4h18" : "M17 8l4 4m0 0l-4 4m4-4H3"} />
                  </svg>
                </span>
              </Link>
              <Link
                href="/services"
                className="group border-2 border-[#6812F7] text-[#6812F7] px-10 py-5 rounded-full text-lg font-semibold hover:bg-[#6812F7] hover:text-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  {t('hero.cta2')}
                  <svg className={`w-5 h-5 ${isRTL ? 'mr-3' : 'ml-2'} group-hover:translate-x-1 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M7 16l-4-4m0 0l4-4m-4 4h18" : "M17 8l4 4m0 0l-4 4m4-4H3"} />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#6812F7] mb-2 group-hover:scale-110 transition-transform duration-300">2025</div>
                <div className="text-gray-600 font-medium">{t('hero.trustIndicators.founded')}</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#9253F0] mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-gray-600 font-medium">{t('hero.trustIndicators.clientFocused')}</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#6812F7] mb-2 group-hover:scale-110 transition-transform duration-300">∞</div>
                <div className="text-gray-600 font-medium">{t('hero.trustIndicators.innovation')}</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#9253F0] mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-gray-600 font-medium">{t('hero.trustIndicators.satisfaction')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, #6812F7 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, #9253F0 2px, transparent 2px)
              `,
              backgroundSize: '60px 60px'
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center ${isRTL ? 'mb-24' : 'mb-16'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-[#6812F7]/10 rounded-full text-[#6812F7] text-sm font-medium mb-6">
              <span className={`w-2 h-2 bg-[#6812F7] rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></span>
              {t('companyStory.badge')}
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 ${isRTL ? 'mb-8' : 'mb-6'}`}>
              {t('companyStory.title')} <span className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent">{t('companyStory.titleHighlight')}</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-xl flex items-center justify-center mr-6 rtl:mr-0 rtl:ml-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t('companyStory.beginning.title')}</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('companyStory.beginning.description')}
                </p>
              </div>

              <div className="group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#9253F0] to-[#6812F7] rounded-xl flex items-center justify-center mr-6 rtl:mr-0 rtl:ml-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t('companyStory.approach.title')}</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('companyStory.approach.description')}
                </p>
              </div>

              <div className="group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6812F7] to-[#DFC7FE] rounded-xl flex items-center justify-center mr-6 rtl:mr-0 rtl:ml-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t('companyStory.promise.title')}</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('companyStory.promise.description')}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#6812F7]/5 to-[#9253F0]/5 p-8 rounded-3xl border border-[#6812F7]/10 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <div className="text-4xl font-bold text-[#6812F7] mb-3 group-hover:scale-110 transition-transform duration-300">∞</div>
                    <div className="text-gray-600 font-medium">{t('companyStory.stats.innovationPotential')}</div>
                    <div className="text-sm text-gray-500 mt-2">{t('companyStory.stats.innovationDescription')}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <div className="text-4xl font-bold text-[#9253F0] mb-3 group-hover:scale-110 transition-transform duration-300">2024</div>
                    <div className="text-gray-600 font-medium">{t('companyStory.stats.founded')}</div>
                    <div className="text-sm text-gray-500 mt-2">{t('companyStory.stats.foundedDescription')}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <div className="text-4xl font-bold text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
                    <div className="text-gray-600 font-medium">{t('companyStory.stats.clientFocused')}</div>
                    <div className="text-sm text-gray-500 mt-2">{t('companyStory.stats.clientFocusedDescription')}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <div className="text-4xl font-bold text-orange-600 mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
                    <div className="text-gray-600 font-medium">{t('companyStory.stats.satisfaction')}</div>
                    <div className="text-sm text-gray-500 mt-2">{t('companyStory.stats.satisfactionDescription')}</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-[#9253F0] to-[#DFC7FE] rounded-full opacity-30 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('missionVision.mission.title')}</h3>
              <p className="text-gray-600">
                {t('missionVision.mission.description')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('missionVision.vision.title')}</h3>
              <p className="text-gray-600">
                {t('missionVision.vision.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-[#F8F4FF] to-[#E8E0FF] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 40%, rgba(104, 18, 247, 0.1) 50%, transparent 60%),
                linear-gradient(-45deg, transparent 40%, rgba(146, 83, 240, 0.1) 50%, transparent 60%)
              `,
              backgroundSize: '100px 100px'
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-white/50 rounded-full text-[#6812F7] text-sm font-medium mb-6 backdrop-blur-sm">
            <span className={`w-2 h-2 bg-[#6812F7] rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></span>
              {t('values.badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('values.title')} <span className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent">{t('values.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('values.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              // Map value titles to translation keys
              const valueKeyMap: Record<string, string> = {
                'Innovation': 'innovation',
                'Quality': 'quality',
                'Collaboration': 'collaboration',
                'Transparency': 'transparency'
              }
              const valueKey = valueKeyMap[value.title] || 'innovation'

              return (
                <div key={index} className="group relative h-full">
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-white/20 h-full flex flex-col">
                    {/* Icon Container */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <span className="text-3xl">{value.icon}</span>
                      </div>
                      {/* Floating decoration */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-[#9253F0] to-[#DFC7FE] rounded-full opacity-60 group-hover:scale-150 transition-all duration-500"></div>
                    </div>

                    {/* Content */}
                    <div className="text-center flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#6812F7] transition-colors duration-300">
                        {t(`values.items.${valueKey}.title`)}
                      </h3>
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-1">
                        {t(`values.items.${valueKey}.description`)}
                      </p>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#6812F7] to-[#9253F0] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/50 rounded-full text-[#6812F7] font-medium backdrop-blur-sm border border-white/20">
              <span className={`w-2 h-2 bg-[#6812F7] rounded-full ${isRTL ? 'ml-3' : 'mr-3'} animate-pulse`}></span>
              {t('values.bottomCTA')}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('faq.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('faq.description')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const faqNum = index + 1
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <button
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">{t(`faq.items.question${faqNum}`)}</h3>
                    <div className="flex-shrink-0">
                      {openFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-[#6812F7]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{t(`faq.items.answer${faqNum}`)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#6812F7] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {t('cta.getInTouch')}
            </Link>
            <Link
              href="/career"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#6812F7] transition-all duration-300"
            >
              {t('cta.joinTeam')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
})
