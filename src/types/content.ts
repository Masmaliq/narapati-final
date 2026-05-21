import type {PortableTextBlock} from '@portabletext/types'

export type Category = {
  title: string
  slug: string
  description: string
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
