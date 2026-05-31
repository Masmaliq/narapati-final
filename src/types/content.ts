import type {PortableTextBlock} from '@portabletext/types'

export type Category = {
  title: string
  slug: string
  description: string
  order?: number
}

export type Author = {
  name: string
  role: string
  image?: string
}

export type Article = {
  title: string
  slug: string
  dek: string
  category: Category
  publishedAt: string
  image: string
  imageAlt?: string
  imageCaption?: string
  imageCredit?: string
  author: Author
  body?: PortableTextBlock[]
  featured?: boolean
}

export type MediaItem = {
  title: string
  slug: string
  dek: string
  publishedAt: string
  image: string
  duration: string
  videoUrl?: string
  youtubeUrl?: string
}

export type PhotographyItem = MediaItem & {
  location?: string
  category?: Category
  author?: Author
  gallery?: string[]
  body?: PortableTextBlock[]
  featured?: boolean
}

export type SiteSettings = {
  siteTitle: string
  tagline: string
  description: string
  address: string
  contactEmail: string
  whatsapp: string
  instagram: string
  youtube: string
  linkedin: string
  twitterX: string
  privacyText: string
  kodeEtikText: string
  footerCopyright: string
  aboutContent: string
  redaksiContent: string
  contactContent: string
  advertiseContent: string
}
