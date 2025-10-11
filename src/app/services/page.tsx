'use client'

import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'

export default function Services() {
  const { t, language } = useLanguage();

  const services = [
    {
      title: t('home.services.aiSolutions.title'),
      description: t('home.services.aiSolutions.description'),
      features: t('home.services.aiSolutions.features'),
      icon: "🤖",
      color: "white"
    },
    {
      title: t('home.services.automation.title'),
      description: t('home.services.automation.description'),
      features: t('home.services.automation.features'),
      icon: "⚙️",
      color: "white"
    },
    {
      title: t('home.services.design.title'),
      description: t('home.services.design.description'),
      features: t('home.services.design.features'),
      icon: "🎨",
      color: "white"
    },
    {
      title: t('home.services.marketing.title'),
      description: t('home.services.marketing.description'),
      features: t('home.services.marketing.features'),
      icon: "📈",
      color: "orange"
    },
    {
      title: t('home.services.mvp.title'),
      description: t('home.services.mvp.description'),
      features: t('home.services.mvp.features'),
      icon: "🚀",
      color: "indigo"
    },
    {
      title: t('home.services.dataAnalysis.title'),
      description: t('home.services.dataAnalysis.description'),
      features: t('home.services.dataAnalysis.features'),
      icon: "📊",
      color: "pink"
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
      purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-600",
      green: "from-green-50 to-green-100 border-green-200 text-green-600",
      orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-600",
      indigo: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-600",
      pink: "from-pink-50 to-pink-100 border-pink-200 text-pink-600",
      white: "from-white to-white border-white text-white"
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('services.hero.title')} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('services.hero.subtitle')}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('services.hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
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
                    {service.title}
                  </h3>
                </div>

                {/* Hover State - Solid Color with Description and CTA */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-start p-8">
                  <h3 className="text-4xl font-bold text-white mb-6">
                    {service.title}
                  </h3>
                  <div className="flex-1 flex flex-col justify-end">
                    <p className="text-white/90 text-base mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <Link
                      href="#"
                      className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 w-fit"
                    >
                      {t('nav.getStarted')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
              <span className="text-sm font-semibold text-gray-700">{t('services.process.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('services.process.title')} <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">{t('services.process.subtitle')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('services.process.description')}
            </p>
          </div>

          {/* Simple Process Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl mx-auto mb-6">
                📋
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. {t('services.process.steps.discovery.title')}</h3>
              <p className="text-gray-600">{t('services.process.steps.discovery.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl mx-auto mb-6">
                🛠️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. {t('services.process.steps.development.title')}</h3>
              <p className="text-gray-600">{t('services.process.steps.development.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl mx-auto mb-6">
                🚀
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. {t('services.process.steps.launch.title')}</h3>
              <p className="text-gray-600">{t('services.process.steps.launch.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('services.cta.title')}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t('services.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#6812F7] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {t('services.cta.getQuote')}
            </Link>
            <Link
              href="/work"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#6812F7] transition-all duration-300"
            >
              {t('services.cta.viewWork')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
