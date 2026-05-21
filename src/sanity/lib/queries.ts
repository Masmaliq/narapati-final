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

export const CATEGORY_QUERY = defineQuery(`*[
  _type == "category" &&
  !(_id in path("drafts.**")) &&
  slug.current == $slug
][0] {
  title,
  "slug": slug.current,
  "description": coalesce(description, "")
}`)

export const CATEGORIES_QUERY = defineQuery(`*[
  _type == "category" &&
  !(_id in path("drafts.**")) &&
  defined(title) &&
  defined(slug.current)
] | order(title asc) {
  title,
  "slug": slug.current,
  "description": coalesce(description, "")
}`)

export const CATEGORY_ARTICLES_QUERY = defineQuery(`*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  category->slug.current == $slug
] | order(publishedAt desc) {
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

export const VIDEOS_QUERY = defineQuery(`*[
  _type == "video" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current)
] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  dek,
  publishedAt,
  duration,
  "image": coverImage.asset->url,
  videoUrl,
  youtubeUrl
}`)

export const VIDEO_DETAIL_QUERY = defineQuery(`*[
  _type == "video" &&
  !(_id in path("drafts.**")) &&
  slug.current == $slug
][0] {
  title,
  "slug": slug.current,
  dek,
  publishedAt,
  duration,
  "image": coverImage.asset->url,
  videoUrl,
  youtubeUrl
}`)

export const PHOTOGRAPHY_QUERY = defineQuery(`*[
  _type == "photography" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current)
] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  "dek": coalesce(description, pt::text(body), ""),
  publishedAt,
  "duration": coalesce(location, category->title, "Photography"),
  "image": mainImage.asset->url,
  location,
  featured,
  "category": category->{title, "slug": slug.current, description},
  "author": photographer->{name, role, "image": image.asset->url}
}`)

export const PHOTOGRAPHY_DETAIL_QUERY = defineQuery(`*[
  _type == "photography" &&
  !(_id in path("drafts.**")) &&
  slug.current == $slug
][0] {
  title,
  "slug": slug.current,
  "dek": coalesce(description, pt::text(body), ""),
  publishedAt,
  "duration": coalesce(location, category->title, "Photography"),
  "image": mainImage.asset->url,
  "gallery": gallery[].asset->url,
  location,
  featured,
  body,
  "category": category->{title, "slug": slug.current, description},
  "author": photographer->{name, role, "image": image.asset->url}
}`)
