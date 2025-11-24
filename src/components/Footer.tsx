'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const t = useTranslations('common')
  const tFooter = useTranslations('footer')

  const footerLinks = {
    services: [
      { name: tFooter('services.aiSolutions'), href: '/services#ai' },
      { name: tFooter('services.automation'), href: '/services#automation' },
      { name: tFooter('services.designUXUI'), href: '/services#design' },
      { name: tFooter('services.marketingSolutions'), href: '/services#marketing' },
      { name: tFooter('services.qualityAssurance'), href: '/services#qa' },
      { name: tFooter('services.support247'), href: '/services#support' }
    ],
    company: [
      { name: tFooter('company.aboutUs'), href: '/about' },
      { name: tFooter('company.ourWork'), href: '/work' },
      { name: tFooter('company.blog'), href: '/blog' },
      { name: tFooter('company.careers'), href: '/career' },
      { name: tFooter('company.contact'), href: '/contact' }
    ],
    resources: [
      { name: tFooter('resources.caseStudies'), href: '/work' },
      { name: tFooter('resources.whitePapers'), href: '/blog' },
      { name: tFooter('resources.webinars'), href: '/blog' },
      { name: tFooter('resources.documentation'), href: '/contact' },
      { name: tFooter('resources.supportCenter'), href: '/contact' }
    ]
  }

  const socialLinks = [
    { name: 'LinkedIn', href: '#', icon: '💼' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'GitHub', href: '#', icon: '🐙' },
    { name: 'Instagram', href: '#', icon: '📷' }
  ]

  return (
    <footer className="bg-[#F2F3FF] border-t border-[#DFC7FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#6812F7] to-[#9253F0] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">Tasami</span>
              </Link>
              <p className="text-gray-600 mb-6 max-w-md">
                {tFooter('companyDescription')}
              </p>

              {/* Company Deck Download */}
              <div className="mb-6">
                <button className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('downloadCompanyDeck')}
                </button>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-[#6812F7] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    aria-label={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{tFooter('services.title')}</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#6812F7] transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{tFooter('company.title')}</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#6812F7] transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{tFooter('resources.title')}</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#6812F7] transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>


        {/* Bottom Footer */}
        <div className="py-6 border-t border-[#DFC7FE]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              © {currentYear} Tasami. {t('allRightsReserved')}.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-600 hover:text-[#6812F7] text-sm transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-[#6812F7] text-sm transition-colors">
                {t('termsOfService')}
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-[#6812F7] text-sm transition-colors">
                {t('cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
