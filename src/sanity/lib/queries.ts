import {defineQuery} from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0] {
  siteTitle,
  tagline,
  description,
  address,
  contactEmail,
  whatsapp,
  instagram,
  youtube,
  linkedin,
  twitterX,
  privacyText,
  kodeEtikText,
  footerCopyright,
  aboutContent,
  redaksiContent,
  contactContent,
  advertiseContent
}`)

const ARTICLE_CARD_FIELDS = `{
  title,
  "slug": slug.current,
  "dek": coalesce(dek, ""),
  featured,
  publishedAt,
  "image": mainImage.asset->url,
  "category": category->{title, "slug": slug.current, "description": coalesce(description, "")},
  "author": author->{name, role, "image": image.asset->url}
}`

const VIDEO_CARD_FIELDS = `{
  title,
  "slug": slug.current,
  dek,
  publishedAt,
  duration,
  "image": coverImage.asset->url,
  videoUrl,
  youtubeUrl
}`

const PHOTOGRAPHY_CARD_FIELDS = `{
  title,
  "slug": slug.current,
  "dek": coalesce(description, pt::text(body), ""),
  publishedAt,
  "duration": coalesce(location, category->title, "Photography"),
  "image": mainImage.asset->url,
  location,
  featured,
  "category": category->{title, "slug": slug.current, "description": coalesce(description, "")},
  "author": photographer->{name, role, "image": image.asset->url}
}`

export const HOMEPAGE_SETTINGS_QUERY = defineQuery(`*[_type == "homepageSettings" && _id == "homepageSettings"][0] {
  sectionOrder[]{section, visible},
  "heroArticle": heroArticle->${ARTICLE_CARD_FIELDS},
  "featuredArticle": featuredArticle->${ARTICLE_CARD_FIELDS},
  "journalArticles": journalArticles[]->${ARTICLE_CARD_FIELDS},
  "globalArticles": globalArticles[]->${ARTICLE_CARD_FIELDS},
  "insightArticles": insightArticles[]->${ARTICLE_CARD_FIELDS},
  "marketArticles": marketArticles[]->${ARTICLE_CARD_FIELDS},
  "videoItems": videoItems[]->${VIDEO_CARD_FIELDS},
  "photographyItems": photographyItems[]->${PHOTOGRAPHY_CARD_FIELDS}
}`)

export const ARTICLES_QUERY = defineQuery(`*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current)
] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  "dek": coalesce(dek, ""),
  featured,
  publishedAt,
  "image": mainImage.asset->url,
  "category": category->{title, "slug": slug.current, "description": coalesce(description, "")},
  "author": author->{name, role, "image": image.asset->url}
}`)

export const ARTICLE_QUERY = defineQuery(`*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  slug.current == $slug
][0] {
  title,
  "slug": slug.current,
  "dek": coalesce(dek, ""),
  featured,
  publishedAt,
  body,
  "image": mainImage.asset->url,
  "imageAlt": coalesce(mainImage.alt, title),
  "imageCaption": coalesce(mainImage.caption, ""),
  "imageCredit": coalesce(mainImage.credit, ""),
  "imageLocation": coalesce(mainImage.location, ""),
  "imageDateTaken": coalesce(mainImage.dateTaken, ""),
  "category": category->{title, "slug": slug.current, "description": coalesce(description, "")},
  "author": author->{name, role, "image": image.asset->url}
}`)

export const CATEGORY_QUERY = defineQuery(`*[
  _type == "category" &&
  !(_id in path("drafts.**")) &&
  slug.current == $slug
][0] {
  title,
  "slug": slug.current,
  order,
  "description": coalesce(description, "")
}`)

export const CATEGORIES_QUERY = defineQuery(`*[
  _type == "category" &&
  !(_id in path("drafts.**")) &&
  defined(title) &&
  defined(slug.current)
] | order(coalesce(order, 9999) asc, title asc) {
  title,
  "slug": slug.current,
  order,
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
  "category": category->{title, "slug": slug.current, "description": coalesce(description, "")},
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
  "category": category->{title, "slug": slug.current, "description": coalesce(description, "")},
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
  "category": category->{title, "slug": slug.current, "description": coalesce(description, "")},
  "author": photographer->{name, role, "image": image.asset->url}
}`)
