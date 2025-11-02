'use client'

import Image from 'next/image'
import { Project } from '@/hooks/useProject'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

interface ProjectCaseStudyProps {
  project: Project;
}

// Helper function to get the correct image source
const getImageSrc = (image: string | null | undefined) => {
  if (!image) return null;

  // If it's a full URL (http, https, or blob), return as is
  if (image.startsWith('http') || image.startsWith('blob:')) {
    return image;
  }

  // If it's a base64 image, return as is
  if (image.startsWith('data:image/')) {
    return image;
  }

  // If it's a filename (contains extension), construct the full URL
  if (image.includes('.') && image.length > 10) {
    return `http://localhost:3002/uploads/images/${image}`;
  }

  // For anything else, return null
  return null;
};

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const t = useTranslations('work.projectCaseStudy')
  const locale = useLocale()
  const isRTL = locale === 'ar'

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'text-right' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Left Sidebar - Navigation & Metadata */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 sticky top-8">
              <div className="space-y-6">
                {/* Project Metadata */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('company')}</h3>
                    <p className="text-lg font-medium text-gray-900">{project.company || project.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('category')}</h3>
                    <p className="text-lg font-medium text-gray-900">{project.category}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('timeline')}</h3>
                    <p className="text-lg font-medium text-gray-900">{project.timeline}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('servicesWeProvided')}</h3>
                    <div className={`flex flex-wrap gap-2 mt-2 ${isRTL ? 'justify-end' : ''}`}>
                      {(project.services || project.technologies.slice(0, 3)).map((service, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {typeof service === 'string' ? service : service.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Share */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{t('shareThisCaseStudy')}</h3>
                  <div className={`flex ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-3'}`}>
                    <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </button>
                    <button className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-900 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Article Style */}
          <div className="lg:col-span-3">
            {/* Project Title */}
            <h1 className={`text-5xl md:text-6xl font-bold text-gray-900 mb-16 ${isRTL ? 'text-right' : ''}`}>
              {project.title}
            </h1>

            {/* Hero Image */}
            <div className="mb-16">
              {getImageSrc(project.headerImage) ? (
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={getImageSrc(project.headerImage)!} 
                    alt={project.title}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: '600px' }}
                  />
                </div>
              ) : (
                <div className="relative w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-32 h-32 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h2 className="text-4xl font-bold mb-4">{t('projectShowcase')}</h2>
                      <p className="text-xl opacity-90">{t('interactiveProjectDemonstration')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Content Blocks - Free Form Article */}
            {project.contentBlocks && project.contentBlocks.length > 0 ? (
              project.contentBlocks.map((block, index) => (
                <div key={block.id || index} className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
                  {block.type === 'heading' && (
                    <h2 className={`text-${block.level === 1 ? '5xl' : block.level === 2 ? '4xl' : '3xl'} font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : ''}`}>
                      {block.content}
                    </h2>
                  )}
                  {block.type === 'paragraph' && (
                    <p className={`text-lg text-gray-700 leading-relaxed mb-6 ${isRTL ? 'text-right' : ''}`}>{block.content}</p>
                  )}
                  {block.type === 'image' && (
                    <div className="mb-8">
                      <Image
                        src={block.src || '/api/placeholder/1200/600'}
                        alt={block.alt || ''}
                        width={block.width || 1200}
                        height={block.height || 600}
                        className="w-full h-auto rounded-2xl"
                      />
                      {block.caption && (
                        <p className={`text-sm text-gray-500 mt-2 italic ${isRTL ? 'text-right' : 'text-center'}`}>{block.caption}</p>
                      )}
                    </div>
                  )}
                  {block.type === 'imageGrid' && (
                    <div className={`grid grid-cols-2 md:grid-cols-${block.columns || 3} gap-6 mb-8`}>
                      {block.images?.map((image, imgIndex) => (
                        <div key={imgIndex} className="group relative">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={image.width || 400}
                            height={image.height || 300}
                            className="w-full h-auto rounded-xl hover:shadow-lg transition-shadow"
                          />
                          {image.caption && (
                            <p className={`text-sm text-gray-500 mt-2 ${isRTL ? 'text-right' : 'text-center'}`}>{image.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={`py-12 text-gray-500 ${isRTL ? 'text-right' : 'text-center'}`}>
                <p className="text-lg mb-4">{t('noContentAddedYet')}</p>
                <p className="text-sm">{t('noContentDescription')}</p>
              </div>
            )}

            {/* Client Testimonial */}
            {project.clientTestimonial && (
              <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl mb-12 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full translate-y-24 -translate-x-24"></div>
                
                <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
                  {/* Quote icon with enhanced styling */}
                  <div className="mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Testimonial quote with enhanced typography */}
                  <blockquote className={`text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-12 leading-tight max-w-4xl mx-auto ${isRTL ? 'text-right' : ''}`}>
                    <span className="text-blue-600 font-bold">"</span>
                    {project.clientTestimonial.quote}
                    <span className="text-blue-600 font-bold">"</span>
                  </blockquote>
                  
                  {/* Author section with enhanced design */}
                  <div className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 ${isRTL ? 'sm:flex-row-reverse sm:space-x-reverse sm:space-x-6' : 'sm:space-x-6'}`}>
                    {/* Avatar with gradient background */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25">
                        {project.clientTestimonial.author.charAt(0)}
                      </div>
                      {/* Decorative ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/20 scale-110"></div>
                    </div>
                    
                    {/* Author info with enhanced styling */}
                    <div className={`${isRTL ? 'text-right sm:text-right' : 'text-center sm:text-left'}`}>
                      <p className="font-bold text-gray-900 text-xl mb-1">{project.clientTestimonial.author}</p>
                      <p className="text-gray-600 text-lg font-medium">{project.clientTestimonial.position}</p>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="mt-12 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  </div>
                </div>
            </section>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}