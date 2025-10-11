'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function About() {
  const { t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const values = [
    {
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      icon: "💡"
    },
    {
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description'),
      icon: "⭐"
    },
    {
      title: t('about.values.collaboration.title'),
      description: t('about.values.collaboration.description'),
      icon: "🤝"
    },
    {
      title: t('about.values.transparency.title'),
      description: t('about.values.transparency.description'),
      icon: "🔍"
    }
  ].filter(value => value.title && value.description); // Filter out any invalid entries


  const faqsData = t('about.faq.questions');
  const faqs = Array.isArray(faqsData) ? faqsData : [];

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
              <span className="w-2 h-2 bg-[#6812F7] rounded-full mr-3 ml-2 animate-pulse"></span>
              {t('about.hero.badge')}
            </div>

            {/* Enhanced Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[0.9] mb-8">
              {t('about.hero.title')}
              <span className="block bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mt-2">
                {t('about.hero.subtitle')}
              </span>
            </h1>

            {/* Enhanced Description */}
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              {t('about.hero.description')}
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                href="/contact"
                className="group bg-gradient-to-r from-[#6812F7] to-[#9253F0] text-white px-10 py-5 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  {t('about.hero.workWithUs')}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/services"
                className="group border-2 border-[#6812F7] text-[#6812F7] px-10 py-5 rounded-full text-lg font-semibold hover:bg-[#6812F7] hover:text-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  {t('about.hero.ourServices')}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#6812F7] mb-2 group-hover:scale-110 transition-transform duration-300">2024</div>
                <div className="text-gray-600 font-medium">{t('about.stats.founded')}</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#9253F0] mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-gray-600 font-medium">{t('about.stats.clientFocused')}</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#6812F7] mb-2 group-hover:scale-110 transition-transform duration-300">∞</div>
                <div className="text-gray-600 font-medium">{t('about.stats.innovation')}</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-[#9253F0] mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-gray-600 font-medium">{t('about.stats.satisfaction')}</div>
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#6812F7]/10 rounded-full text-[#6812F7] text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#6812F7] rounded-full mr-2 ml-2"></span>
              {t('about.story.badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('about.story.title')} <span className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent">{t('about.story.subtitle')}</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12">
              <div className="group">
                <div className="flex items-start mb-4 gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div className="flex-1 " >
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-4 mt-2">{t('about.story.beginning.title')}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {t('about.story.beginning.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-start mb-6 gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#9253F0] to-[#6812F7] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-4 mt-2">{t('about.story.approach.title')}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {t('about.story.approach.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-start mb-6 gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6812F7] to-[#DFC7FE] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-4 mt-2">{t('about.story.promise.title')}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {t('about.story.promise.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#6812F7]/5 to-[#9253F0]/5 p-8 rounded-3xl border border-[#6812F7]/10 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <div className="text-4xl font-bold text-[#6812F7] mb-3 group-hover:scale-110 transition-transform duration-300">{t('about.stats.innovation.value')}</div>
                    <div className="text-gray-600 font-medium">{t('about.stats.innovation.title')}</div>
                    <div className="text-sm text-gray-500 mt-2">{t('about.stats.innovation.description')}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <div className="text-4xl font-bold text-[#9253F0] mb-3 group-hover:scale-110 transition-transform duration-300">{t('about.stats.founded.value')}</div>
                    <div className="text-gray-600 font-medium">{t('about.stats.founded.title')}</div>
                    <div className="text-sm text-gray-500 mt-2">{t('about.stats.founded.description')}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <div className="text-4xl font-bold text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300">{t('about.stats.clientFocused.value')}</div>
                    <div className="text-gray-600 font-medium">{t('about.stats.clientFocused.title')}</div>
                    <div className="text-sm text-gray-500 mt-2">{t('about.stats.clientFocused.description')}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <div className="text-4xl font-bold text-orange-600 mb-3 group-hover:scale-110 transition-transform duration-300">{t('about.stats.satisfaction.value')}</div>
                    <div className="text-gray-600 font-medium">{t('about.stats.satisfaction.title')}</div>
                    <div className="text-sm text-gray-500 mt-2">{t('about.stats.satisfaction.description')}</div>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission.title')}</h3>
              <p className="text-gray-600">
                {t('about.mission.description')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.vision.title')}</h3>
              <p className="text-gray-600">
                {t('about.vision.description')}
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
              <span className="w-2 h-2 bg-[#6812F7] rounded-full mr-2 ml-2"></span>
              {t('about.values.badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('about.values.title')} <span className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent">{t('about.values.subtitle')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.values.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
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
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-1">
                      {value.description}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#6812F7] to-[#9253F0] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/50 rounded-full text-[#6812F7] font-medium backdrop-blur-sm border border-white/20">
              <span className="w-2 h-2 bg-[#6812F7] rounded-full mr-3 ml-2 animate-pulse"></span>
              {t('about.values.cta')}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.faq.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.faq.description')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs && faqs.length > 0 ? faqs.map((faq: { question: string; answer: string }, index: number) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
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
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                {t('common.loading')}
              </div>
            )}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t('about.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#6812F7] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {t('about.cta.getInTouch')}
            </Link>
            <Link
              href="/career"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#6812F7] transition-all duration-300"
            >
              {t('about.cta.joinTeam')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
