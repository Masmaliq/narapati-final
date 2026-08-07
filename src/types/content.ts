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
  imageLocation?: string
  imageDateTaken?: string
  author: Author
  body?: PortableTextBlock[]
  bodyText?: string
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
  tiktok: string
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

export type NavigationItemType = 'category' | 'internal' | 'external'

export type NavigationItem = {
  label: string
  mobileLabel?: string
  type: NavigationItemType
  href: string
  visible?: boolean
  openInNewTab?: boolean
  highlight?: boolean
}

export type HomepageSectionKey = 'hero' | 'journal' | 'featured' | 'global' | 'insight' | 'market' | 'photography' | 'video'

export type HomepageSectionSetting = {
  section: HomepageSectionKey
  visible?: boolean
}

export type HomepageSettings = {
  sectionOrder?: HomepageSectionSetting[]
  heroArticle?: Article | null
  featuredArticle?: Article | null
  journalArticles?: Article[]
  globalArticles?: Article[]
  insightArticles?: Article[]
  marketArticles?: Article[]
  videoItems?: MediaItem[]
  photographyItems?: PhotographyItem[]
}
