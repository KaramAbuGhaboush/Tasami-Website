/**
 * Utility functions for generating JSON-LD structured data
 */

export interface ArticleStructuredData {
  '@context': string
  '@type': string
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified: string
  author: {
    '@type': string
    name: string
    url?: string
  }
  publisher: {
    '@type': string
    name: string
    logo: {
      '@type': string
      url: string
    }
  }
  mainEntityOfPage: {
    '@type': string
    '@id': string
  }
}

export interface OrganizationStructuredData {
  '@context': string
  '@type': string
  name: string
  url: string
  logo: string
  description: string
  sameAs?: string[]
}

export interface BreadcrumbStructuredData {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

export function generateArticleStructuredData(
  article: {
    title: string
    excerpt?: string
    image?: string
    createdAt: string
    updatedAt: string
    author: { name: string }
    slug: string
  },
  baseUrl: string,
  locale: string
): ArticleStructuredData {
  const articleUrl = `${baseUrl}/${locale}/article/${article.slug}`
  const imageUrl = article.image && article.image.includes('.')
    ? `${baseUrl}/uploads/images/${article.image}`
    : `${baseUrl}/Logo.png`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.title,
    image: imageUrl,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tasami',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/Logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  }
}

export function generateOrganizationStructuredData(baseUrl: string): OrganizationStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tasami',
    url: baseUrl,
    logo: `${baseUrl}/Logo.png`,
    description: 'Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions.',
    sameAs: [
      // Add social media links here if available
    ],
  }
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>,
  baseUrl: string
): BreadcrumbStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  }
}

