import type { Metadata } from 'next'
import { ReactNode } from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN 
    ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
    : 'https://www.tasami.co'
  
  const isArabic = locale === 'ar'
  
  return {
    title: isArabic ? 'المدونة | تسامي' : 'Blog | Tasami',
    description: isArabic
      ? 'اكتشف أحدث المقالات والأفكار حول الذكاء الاصطناعي والأتمتة والتصميم والتسويق'
      : 'Discover the latest articles and insights on AI, automation, design, and marketing',
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        'en': `${baseUrl}/en/blog`,
        'ar': `${baseUrl}/ar/blog`,
      },
    },
    openGraph: {
      type: 'website',
      locale: isArabic ? 'ar_SA' : 'en_US',
      url: `${baseUrl}/${locale}/blog`,
      siteName: 'Tasami',
      title: isArabic ? 'المدونة | تسامي' : 'Blog | Tasami',
      description: isArabic
        ? 'اكتشف أحدث المقالات والأفكار حول الذكاء الاصطناعي والأتمتة والتصميم والتسويق'
        : 'Discover the latest articles and insights on AI, automation, design, and marketing',
    },
  }
}

export default function BlogLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}

