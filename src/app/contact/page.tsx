'use client'

import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

export default function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    service: '',
    budget: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const contactInfo = [
    {
      title: t('contact.contactInfo.email.title'),
      description: t('contact.contactInfo.email.description'),
      contact: "hello@tasami.com",
      icon: "📧",
      urgency: t('contact.contactInfo.email.urgency')
    },
    {
      title: t('contact.contactInfo.whatsapp.title'),
      description: t('contact.contactInfo.whatsapp.description'),
      contact: "+1 (555) 123-4567",
      icon: "💬",
      urgency: t('contact.contactInfo.whatsapp.urgency')
    },
    {
      title: t('contact.contactInfo.ceo.title'),
      description: t('contact.contactInfo.ceo.description'),
      contact: t('contact.contactInfo.ceo.contact'),
      icon: "👔",
      urgency: t('contact.contactInfo.ceo.urgency')
    }
  ]

  const projectTypes = t('contact.form.projectTypes');
  const budgetRanges = t('contact.form.budgetRanges');
  const timelines = t('contact.form.timelines');




  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-200">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.success.title')}</h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('contact.success.description')}
            </p>
            <div className="bg-green-50 p-4 rounded-xl mb-6">
              <p className="text-green-800 font-semibold">
                {t('contact.success.nextSteps')}
              </p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  company: '',
                  projectType: '',
                  budget: '',
                  timeline: '',
                  message: ''
                })
              }}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t('contact.success.startAnother')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full text-blue-600 text-sm font-medium mb-8 border border-blue-200">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></span>
              {t('contact.hero.badge')}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {t('contact.hero.title')}
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                {t('contact.hero.subtitle')}
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              {t('contact.hero.description')}
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-12">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t('contact.hero.indicators.responseTime')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t('contact.hero.indicators.consultation')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t('contact.hero.indicators.guarantee')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t('contact.hero.indicators.noContracts')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Form */}
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
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Get in Touch - Left Side */}
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                  {t('contact.form.title')} <span className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent">{t('contact.form.subtitle')}</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 lg:mb-8">
                  {t('contact.form.description')}
                </p>
              </div>

              <div className="space-y-6 lg:space-y-8">
                <div className="text-center lg:text-left">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">{t('contact.form.alternative.title')}</h4>
                  <p className="text-gray-600 mb-4 lg:mb-6 text-sm sm:text-base">{t('contact.form.alternative.description')}</p>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-gradient-to-r hover:from-[#6812F7]/10 hover:to-[#9253F0]/10 hover:border-[#6812F7]/20 transition-all duration-300">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">📧</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{t('contact.contactMethods.email.title')}</div>
                        <div className="text-gray-600 text-xs sm:text-sm truncate">hello@tasami.com</div>
                      </div>
                    </div>
                    <a href="mailto:hello@tasami.com" className="text-[#6812F7] hover:text-[#9253F0] font-medium transition-colors text-sm sm:text-base flex-shrink-0 ml-2">
                      {t('contact.contactMethods.email.action')} →
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-gradient-to-r hover:from-[#6812F7]/10 hover:to-[#9253F0]/10 hover:border-[#6812F7]/20 transition-all duration-300">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">💬</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{t('contact.contactMethods.whatsapp.title')}</div>
                        <div className="text-gray-600 text-xs sm:text-sm">{t('contact.contactMethods.whatsapp.description')}</div>
                      </div>
                    </div>
                    <a href="https://wa.me/1234567890" className="text-[#6812F7] hover:text-[#9253F0] font-medium transition-colors text-sm sm:text-base flex-shrink-0 ml-2">
                      {t('contact.contactMethods.whatsapp.action')} →
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-gradient-to-r hover:from-[#6812F7]/10 hover:to-[#9253F0]/10 hover:border-[#6812F7]/20 transition-all duration-300">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">👔</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{t('contact.contactMethods.ceo.title')}</div>
                        <div className="text-gray-600 text-xs sm:text-sm">{t('contact.contactMethods.ceo.description')}</div>
                      </div>
                    </div>
                    <a href="#" className="text-[#6812F7] hover:text-[#9253F0] font-medium transition-colors text-sm sm:text-base flex-shrink-0 ml-2">
                      {t('contact.contactMethods.ceo.action')} →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form - Right Side */}
            <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 overflow-hidden h-fit">
              {/* Content */}
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#6812F7]/10 to-[#9253F0]/10 rounded-full text-[#6812F7] text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-[#6812F7] rounded-full mr-2 animate-pulse"></span>
                    {t('contact.form.ready.badge')}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.form.ready.title')}</h2>
                  <p className="text-gray-600 text-lg">{t('contact.form.ready.description')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                        {t('contact.form.fields.name')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500"
                        placeholder={t('contact.form.placeholders.name')}
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="company" className="block text-sm font-bold text-gray-900 mb-2">
                        {t('contact.form.fields.company')}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500"
                        placeholder={t('contact.form.placeholders.company')}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                      {t('contact.form.fields.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500 ${language === 'ar' ? 'text-right placeholder:text-right' : 'text-left placeholder:text-left'}`}
                      placeholder={t('contact.form.placeholders.email')}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                      style={language === 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="service" className="block text-sm font-bold text-gray-900 mb-2">
                        {t('contact.form.fields.service')} *
                      </label>
                      <div className="relative">
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          required
                          className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 appearance-none bg-transparent text-gray-900 pr-8"
                        >
                          <option value="">{t('contact.form.placeholders.service')}</option>
                          {Array.isArray(projectTypes) && projectTypes.map((type: string, index: number) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="group">
                      <label htmlFor="budget" className="block text-sm font-bold text-gray-900 mb-2">
                        {t('contact.form.fields.budget')} *
                      </label>
                      <div className="relative">
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          required
                          className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 appearance-none bg-transparent text-gray-900 pr-8"
                        >
                          <option value="">{t('contact.form.placeholders.budget')}</option>
                          {Array.isArray(budgetRanges) && budgetRanges.map((budget: string, index: number) => (
                            <option key={index} value={budget}>{budget}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                      {t('contact.form.fields.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500 resize-none"
                      placeholder={t('contact.form.placeholders.message')}
                    />
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {t('contact.form.sending')}
                        </div>
                      ) : (
                        t('contact.form.submit')
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 flex items-center justify-center">
                      <span className="mr-2">🔒</span>
                      {t('contact.form.security')}
                    </p>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
