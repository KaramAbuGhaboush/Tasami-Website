'use client'

import { useTranslations } from 'next-intl'
import { ContactFormData, ContactInfo } from '@/hooks/useContact'

interface ContactProps {
  formData: ContactFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  contactInfo: ContactInfo[];
  projectTypes: string[];
  budgetRanges: string[];
}

export function Contact({
  formData,
  isSubmitting,
  isSubmitted,
  handleChange,
  handleSubmit,
  resetForm,
  contactInfo,
  projectTypes,
  budgetRanges
}: ContactProps) {
  const t = useTranslations('contact')
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-200">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('success.title')}</h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('success.message')} <strong>{t('success.messageHighlight')}</strong> {t('success.messageSuffix')}
            </p>
            <div className="bg-green-50 p-4 rounded-xl mb-6">
              <p className="text-green-800 font-semibold">
                {t('success.nextSteps')}
              </p>
            </div>
            <button
              onClick={resetForm}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t('success.startAnother')}
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
              {t('badgeText')}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {t('title1')}
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                {t('title2')}
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              {t('description')}
              <span className="text-blue-600 font-semibold"> {t('descriptionHighlight')}</span>
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-12">
              <div className="flex items-center">
                <span className="text-green-500 mr-3 rtl:mr-0 rtl:ml-3">✓</span>
                <span>{t('trustIndicators.responseTime')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3 rtl:mr-0 rtl:ml-3">✓</span>
                <span>{t('trustIndicators.freeConsultation')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3 rtl:mr-0 rtl:ml-3">✓</span>
                <span>{t('trustIndicators.satisfactionGuarantee')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3 rtl:mr-0 rtl:ml-3">✓</span>
                <span>{t('trustIndicators.noLongTerm')}</span>
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
                  {t('formSection.title')} <span className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent">{t('formSection.titleHighlight')}</span> {t('formSection.titleSuffix')}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 lg:mb-8">
                  {t('formSection.description')}
                </p>
              </div>

              <div className="space-y-6 lg:space-y-8">
                <div className="text-center lg:text-left rtl:text-right">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">{t('formSection.alternativeTitle')}</h4>
                  <p className="text-gray-600 mb-4 lg:mb-6 text-sm sm:text-base">{t('formSection.alternativeDescription')}</p>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  {contactInfo.map((info, index) => {
                    // Map contact info to translation keys
                    const contactKeyMap: Record<string, string> = {
                      'Email Us': 'email',
                      'WhatsApp': 'whatsapp',
                      'Schedule 30 mins meeting with our CEO': 'ceoMeeting'
                    }
                    const contactKey = contactKeyMap[info.title] || 'email'

                    return (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-gradient-to-r hover:from-[#6812F7]/10 hover:to-[#9253F0]/10 hover:border-[#6812F7]/20 transition-all duration-300">
                        <div className="flex items-center min-w-0 flex-1">
                          <div className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">{info.icon}</div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">{t(`contactInfo.${contactKey}.title`)}</div>
                            <div className="text-gray-600 text-xs sm:text-sm truncate">{info.contact}</div>
                          </div>
                        </div>
                        <a
                          href={info.contact.includes('@') ? `mailto:${info.contact}` : info.contact.includes('+') ? `https://wa.me/${info.contact.replace(/[^\d]/g, '')}` : '#'}
                          className="text-[#6812F7] hover:text-[#9253F0] font-medium transition-colors text-sm sm:text-base flex-shrink-0 ml-2"
                        >
                          {t(`contactInfo.${contactKey}.action`)}
                        </a>
                      </div>
                    )
                  })}
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
                    {t('formSection.formBadge')}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('formSection.formTitle')}</h2>
                  <p className="text-gray-600 text-lg">{t('formSection.formDescription')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                        {t('form.labels.fullName')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500"
                        placeholder={t('form.placeholders.fullName')}
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="company" className="block text-sm font-bold text-gray-900 mb-2">
                        {t('form.labels.companyName')}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500"
                        placeholder={t('form.placeholders.companyName')}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                      {t('form.labels.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500"
                      placeholder={t('form.placeholders.email')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="service" className="block text-sm font-bold text-gray-900 mb-2">
                        {t('form.labels.serviceRequired')}
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
                          <option value="">{t('form.selectOptions.selectService')}</option>
                          {projectTypes.map((type, index) => {
                            // Map project types to translation keys
                            const typeKeyMap: Record<string, string> = {
                              'Web Development': 'webDevelopment',
                              'Mobile App Development': 'mobileApp',
                              'AI & Machine Learning': 'aiML',
                              'Business Process Automation': 'automation',
                              'UX/UI Design': 'uxui',
                              'Digital Marketing': 'digitalMarketing',
                              'Data Analytics': 'dataAnalytics',
                              'Cloud Solutions': 'cloudSolutions',
                              'Other': 'other'
                            }
                            const typeKey = typeKeyMap[type] || 'other'
                            return (
                              <option key={index} value={type}>{t(`form.projectTypes.${typeKey}`)}</option>
                            )
                          })}
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
                        {t('form.labels.projectBudget')}
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
                          <option value="">{t('form.selectOptions.selectBudget')}</option>
                          {budgetRanges.map((budget, index) => {
                            // Map budget ranges to translation keys
                            const budgetKeyMap: Record<string, string> = {
                              'Under $10,000': 'under10k',
                              '$10,000 - $25,000': '10k25k',
                              '$25,000 - $50,000': '25k50k',
                              '$50,000 - $100,000': '50k100k',
                              '$100,000+': 'over100k',
                              'Not sure yet': 'notSure'
                            }
                            const budgetKey = budgetKeyMap[budget] || 'notSure'
                            return (
                              <option key={index} value={budget}>{t(`form.budgetRanges.${budgetKey}`)}</option>
                            )
                          })}
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
                      {t('form.labels.projectDetails')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500 resize-none"
                      placeholder={t('form.placeholders.message')}
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
                          {t('form.buttons.sending')}
                        </div>
                      ) : (
                        t('form.buttons.sendInquiry')
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 flex items-center justify-center">
                      <span className="mr-2">🔒</span>
                      {t('form.securityMessage')}
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
