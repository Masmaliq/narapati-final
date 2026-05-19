import {defineQuery} from 'next-sanity'

export const ARTICLES_QUERY = defineQuery(`*[_type == "article"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  dek,
  featured,
  publishedAt,
  "image": mainImage.asset->url,
  "category": category->{title, "slug": slug.current, description},
  "author": author->{name, role, "image": image.asset->url}
}`)

export const ARTICLE_QUERY = defineQuery(`*[_type == "article" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  dek,
  featured,
  publishedAt,
  body,
  "image": mainImage.asset->url,
  "category": category->{title, "slug": slug.current, description},
  "author": author->{name, role, "image": image.asset->url}
}`)

export const CATEGORY_QUERY = defineQuery(`*[_type == "category" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  description
}`)

export const CATEGORIES_QUERY = defineQuery(`*[_type == "category"] | order(title asc) {
  title,
  "slug": slug.current,
  description
}`)

export const CATEGORY_ARTICLES_QUERY = defineQuery(`*[_type == "article" && category->slug.current == $slug] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  dek,
  featured,
  publishedAt,
  "image": mainImage.asset->url,
  "category": category->{title, "slug": slug.current, description},
  "author": author->{name, role, "image": image.asset->url}
}`)

export const PODCASTS_QUERY = defineQuery(`*[_type == "podcast"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  dek,
  publishedAt,
  duration,
  "image": coverImage.asset->url
}`)

export const VIDEOS_QUERY = defineQuery(`*[_type == "video"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  dek,
  publishedAt,
  duration,
  "image": coverImage.asset->url
}`)
