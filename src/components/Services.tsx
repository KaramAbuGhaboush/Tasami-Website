'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { memo } from 'react'
import { Service, ProcessStep } from '@/hooks/useServices'

interface ServicesProps {
  services: Service[];
  processSteps: ProcessStep[];
}

export const Services = memo(function Services({ services, processSteps }: ServicesProps) {
  const t = useTranslations('services')
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="-mt-20 pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('hero.title')} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              // Map service to translation key
              const serviceKeyMap: Record<string, string> = {
                'AI Solutions': 'aiSolutions',
                'Automation': 'automation',
                'Design & UX/UI': 'design',
                'Marketing Solutions': 'marketing',
                'Quality Assurance': 'qualityAssurance',
                '24/7 Support': 'support'
              }
              const serviceKey = serviceKeyMap[service.title] || 'aiSolutions'

              return (
                <div
                  key={index}
                  className="group relative h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500"><rect width="300" height="500" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="48">${service.icon}</text></svg>')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Default State - Background Image with Title */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300 flex flex-col justify-start p-8">
                    <h3 className="text-4xl font-bold text-black group-hover:opacity-0 transition-opacity duration-300">
                      {t(`serviceItems.${serviceKey}.title`)}
                    </h3>
                  </div>

                  {/* Hover State - Solid Color with Description and CTA */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-start p-8">
                    <h3 className="text-4xl font-bold text-white mb-6">
                      {t(`serviceItems.${serviceKey}.title`)}
                    </h3>
                    <div className="flex-1 flex flex-col justify-end">
                      <p className="text-white/90 text-base mb-6 leading-relaxed">
                        {t(`serviceItems.${serviceKey}.description`)}
                      </p>
                      <Link
                        href="#"
                        className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 w-fit"
                      >
                        {t('getStarted')}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-sm font-semibold text-gray-700">{t('process.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('process.title')} <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">{t('process.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('process.description')}
            </p>
          </div>

          {/* Process Steps */}
          <div className="relative">
            {/* Desktop Process Flow */}
            <div className="hidden lg:block">
              <div className="flex items-start justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300"></div>

                {processSteps.map((item, index) => {
                  const stepKey = `step${index + 1}`

                  return (
                    <div key={index} className="flex flex-col items-center relative z-10">
                      {/* Step Circle */}
                      <div className={`w-24 h-24 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                        <span className="text-3xl">{item.icon}</span>
                      </div>

                      {/* Step Number */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-lg">
                        {item.step}
                      </div>

                      {/* Step Content */}
                      <div className="mt-8 text-center max-w-xs">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{t(`process.steps.${stepKey}.title`)}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{t(`process.steps.${stepKey}.description`)}</p>

                        {/* Features List */}
                        <div className="space-y-2">
                          {[1, 2, 3].map((featureIndex) => (
                            <div key={featureIndex} className="flex items-center justify-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                              <span className="text-xs text-gray-500 font-medium">{t(`process.steps.${stepKey}.features.feature${featureIndex}`)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mobile Process Flow */}
            <div className="lg:hidden space-y-12">
              {processSteps.map((item, index) => {
                const stepKey = `step${index + 1}`

                return (
                  <div key={index} className="flex items-start space-x-6 relative">
                    {/* Step Circle */}
                    <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0`}>
                      <span className="text-2xl">{item.icon}</span>
                    </div>

                    {/* Step Number */}
                    <div className="absolute top-0 left-16 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-lg">
                      {item.step}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{t(`process.steps.${stepKey}.title`)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{t(`process.steps.${stepKey}.description`)}</p>

                      {/* Features List */}
                      <div className="space-y-2">
                        {[1, 2, 3].map((featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            <span className="text-xs text-gray-500 font-medium">{t(`process.steps.${stepKey}.features.feature${featureIndex}`)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Connecting Line (except for last item) */}
                    {index < processSteps.length - 1 && (
                      <div className="absolute left-10 top-20 w-0.5 h-12 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                    )}
                  </div>
                )
              })}
            </div>
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
              {t('cta.getQuote')}
            </Link>
            <Link
              href="/work"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#6812F7] transition-all duration-300"
            >
              {t('cta.viewWork')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
})
