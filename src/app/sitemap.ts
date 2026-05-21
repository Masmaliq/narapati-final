import type {MetadataRoute} from 'next'
import {absoluteUrl, articlePath, isoDate} from '@/lib/seo'
import {getArticles, getCategories} from '@/sanity/lib/fetch'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()])
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {url: absoluteUrl('/'), lastModified: now, changeFrequency: 'daily', priority: 1},
    {url: absoluteUrl('/video'), lastModified: now, changeFrequency: 'weekly', priority: 0.7},
    {url: absoluteUrl('/photography'), lastModified: now, changeFrequency: 'weekly', priority: 0.7},
    {url: absoluteUrl('/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.5},
    {url: absoluteUrl('/redaksi'), lastModified: now, changeFrequency: 'monthly', priority: 0.5},
    {url: absoluteUrl('/privacy'), lastModified: now, changeFrequency: 'yearly', priority: 0.3}
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/category/${encodeURIComponent(category.slug)}`),
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8
  }))

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(articlePath(article.slug)),
    lastModified: new Date(isoDate(article.publishedAt)),
    changeFrequency: 'weekly',
    priority: article.featured ? 0.9 : 0.75
  }))

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes]
}
