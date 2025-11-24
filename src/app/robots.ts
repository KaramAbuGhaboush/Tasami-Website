import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN 
    ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
    : 'https://www.tasami.co'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/employee/',
          '/login/',
          '/_next/',
          '/test-api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

