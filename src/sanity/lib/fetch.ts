import {articles, categories, photography, podcasts, siteSettings, videos} from '@/data/fallback'
import type {Article, Category, HomepageSettings, MediaItem, PhotographyItem, SiteSettings} from '@/types/content'
import {isSanityConfigured} from '../env'
import {client} from './client'
import {
  ARTICLE_QUERY,
  ARTICLES_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_ARTICLES_QUERY,
  CATEGORY_QUERY,
  HOMEPAGE_SETTINGS_QUERY,
  PHOTOGRAPHY_DETAIL_QUERY,
  PHOTOGRAPHY_QUERY,
  PODCASTS_QUERY,
  SITE_SETTINGS_QUERY,
  VIDEO_DETAIL_QUERY,
  VIDEOS_QUERY
} from './queries'

type ReadOptions = {
  fallbackOnEmpty?: boolean
  fallbackOnError?: boolean
}

const SANITY_READ_TIMEOUT_MS = 8000

async function read<T>(query: string, params = {}, fallback: T, options: ReadOptions = {}): Promise<T> {
  if (!isSanityConfigured) return fallback

  try {
    const data = await Promise.race([
      client.fetch<T>(query, params, {cache: 'no-store'}),
      new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error('Sanity request timed out')), SANITY_READ_TIMEOUT_MS)
      })
    ])
    if (Array.isArray(data) && data.length === 0) {
      return options.fallbackOnEmpty === false ? data : fallback
    }
    return data || fallback
  } catch {
    if (options.fallbackOnError === false) {
      if (Array.isArray(fallback)) return [] as T
      return null as T
    }
    return fallback
  }
}

export function getArticles() {
  return read<Article[]>(ARTICLES_QUERY, {}, articles)
}

export async function getSiteSettings() {
  const settings = await read<Partial<SiteSettings>>(SITE_SETTINGS_QUERY, {}, siteSettings)
  return {...siteSettings, ...settings}
}

export async function getHomepageSettings() {
  return read<HomepageSettings | null>(HOMEPAGE_SETTINGS_QUERY, {}, null, {fallbackOnError: false})
}

export async function getArticle(slug: string) {
  const fallback = articles.find((article) => article.slug === slug) || null
  const article = await read<Article | null>(ARTICLE_QUERY, {slug}, fallback)

  if (article) return article

  const allArticles = await getArticles()
  return allArticles.find((item) => item.slug === slug) || null
}

export async function getCategory(slug: string) {
  const fallback = categories.find((category) => category.slug === slug) || null
  return read<Category | null>(CATEGORY_QUERY, {slug}, fallback, {fallbackOnError: false})
}

export async function getCategoryArticles(slug: string) {
  const fallback = articles.filter((article) => article.category.slug === slug)
  return read<Article[]>(CATEGORY_ARTICLES_QUERY, {slug}, fallback, {fallbackOnEmpty: false, fallbackOnError: false})
}

export function getCategories() {
  return read<Category[]>(CATEGORIES_QUERY, {}, categories, {fallbackOnEmpty: false, fallbackOnError: false})
}

export function getPodcasts() {
  return read<MediaItem[]>(PODCASTS_QUERY, {}, podcasts)
}

export function getVideos() {
  return read<MediaItem[]>(VIDEOS_QUERY, {}, videos)
}

export async function getVideo(slug: string) {
  const fallback = videos.find((item) => item.slug === slug) || null
  return read<MediaItem | null>(VIDEO_DETAIL_QUERY, {slug}, fallback)
}

export function getPhotography() {
  return read<PhotographyItem[]>(PHOTOGRAPHY_QUERY, {}, photography)
}

export async function getPhotographyItem(slug: string) {
  const fallback = photography.find((item) => item.slug === slug) || null
  return read<PhotographyItem | null>(PHOTOGRAPHY_DETAIL_QUERY, {slug}, fallback)
}
