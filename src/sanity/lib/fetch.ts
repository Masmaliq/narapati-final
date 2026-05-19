import {articles, categories, podcasts, videos} from '@/data/fallback'
import type {Article, Category, MediaItem} from '@/types/content'
import {isSanityConfigured} from '../env'
import {client} from './client'
import {
  ARTICLE_QUERY,
  ARTICLES_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_ARTICLES_QUERY,
  CATEGORY_QUERY,
  PODCASTS_QUERY,
  VIDEOS_QUERY
} from './queries'

async function read<T>(query: string, params = {}, fallback: T): Promise<T> {
  if (!isSanityConfigured) return fallback

  try {
    const data = await client.fetch<T>(query, params, {next: {revalidate: 60}})
    if (Array.isArray(data) && data.length === 0) return fallback
    return data || fallback
  } catch {
    return fallback
  }
}

export function getArticles() {
  return read<Article[]>(ARTICLES_QUERY, {}, articles)
}

export async function getArticle(slug: string) {
  const fallback = articles.find((article) => article.slug === slug) || null
  return read<Article | null>(ARTICLE_QUERY, {slug}, fallback)
}

export async function getCategory(slug: string) {
  const fallback = categories.find((category) => category.slug === slug) || null
  return read<Category | null>(CATEGORY_QUERY, {slug}, fallback)
}

export async function getCategoryArticles(slug: string) {
  const fallback = articles.filter((article) => article.category.slug === slug)
  return read<Article[]>(CATEGORY_ARTICLES_QUERY, {slug}, fallback)
}

export function getCategories() {
  return read<Category[]>(CATEGORIES_QUERY, {}, categories)
}

export function getPodcasts() {
  return read<MediaItem[]>(PODCASTS_QUERY, {}, podcasts)
}

export function getVideos() {
  return read<MediaItem[]>(VIDEOS_QUERY, {}, videos)
}
