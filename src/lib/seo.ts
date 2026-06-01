import type {Article} from '@/types/content'

export const siteName = 'Narapati Journal'
export const siteDescription = 'Premium independent journalism from Narapati Journal.'
export const defaultOgImage = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://narapatinews.com').replace(/\/$/, '')

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//.test(path)) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function articlePath(slug: string) {
  return `/article/${encodeURIComponent(slug)}`
}

export function articleUrl(slug: string) {
  return absoluteUrl(articlePath(slug))
}

export function imageUrl(src?: string) {
  if (!src) return defaultOgImage
  return absoluteUrl(src)
}

export function metaDescription(value?: string) {
  const text = value?.replace(/\s+/g, ' ').trim()
  if (!text) return siteDescription
  return text.length > 158 ? `${text.slice(0, 155).trim()}...` : text
}

export function isoDate(value?: string) {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return new Date().toISOString()
  return date.toISOString()
}

export function articleJsonLd(article: Article) {
  const canonical = articleUrl(article.slug)
  const description = metaDescription(article.dek)

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical
    },
    headline: article.title,
    description,
    image: [imageUrl(article.image)],
    datePublished: isoDate(article.publishedAt),
    dateModified: isoDate(article.publishedAt),
    articleSection: article.category.title,
    author: {
      '@type': 'Person',
      name: article.author.name
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl
    },
    url: canonical
  }
}
