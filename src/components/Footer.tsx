'use client'

import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear()

  const footerLinks = t('footer.links');
  const socialLinks = t('footer.social');

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
                {t('footer.description')}
              </p>

              {/* Company Deck Download */}
              <div className="mb-6">
                <button className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('footer.downloadDeck')}
                </button>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {Array.isArray(socialLinks) && socialLinks.map((social: any, index: number) => (
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('footer.sections.services')}</h3>
              <ul className="space-y-3">
                {Array.isArray(footerLinks?.services) && footerLinks.services.map((link: any, index: number) => (
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('footer.sections.company')}</h3>
              <ul className="space-y-3">
                {Array.isArray(footerLinks?.company) && footerLinks.company.map((link: any, index: number) => (
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('footer.sections.resources')}</h3>
              <ul className="space-y-3">
                {Array.isArray(footerLinks?.resources) && footerLinks.resources.map((link: any, index: number) => (
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
              {t('footer.copyright').replace('{year}', currentYear.toString())}
            </div>
            <div className="flex flex-row gap-6 space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-600 hover:text-[#6812F7] text-sm transition-colors">
                {t('footer.links.privacy')}
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-[#6812F7] text-sm transition-colors">
                {t('footer.links.terms')}
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-[#6812F7] text-sm transition-colors">
                {t('footer.links.cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
