import Link from 'next/link'
import {SearchOverlay, type SearchArticle} from '@/components/SearchOverlay'
import {getArticles, getCategories} from '@/sanity/lib/fetch'

const fallbackNavItems = [
  ['Home', '/'],
  ['Dunia', '/category/dunia'],
  ['Analisa', '/category/analisa'],
  ['Nilai Hidup', '/category/nilai-hidup']
]

const fallbackTopics = [
  ['Kepemimpinan', '/category/kepemimpinan'],
  ['Ekonomi', '/category/ekonomi'],
  ['Bisnis', '/category/bisnis'],
  ['Teknologi', '/category/teknologi'],
  ['Investasi', '/category/investasi'],
  ['Indonesia Emas', '/category/indonesia-emas']
]

export async function Header() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()])
  const searchArticles: SearchArticle[] = articles.map((article) => ({
    title: article.title,
    slug: article.slug,
    dek: article.dek,
    image: article.image,
    publishedAt: article.publishedAt,
    category: {
      title: article.category.title,
      slug: article.category.slug
    },
    author: {
      name: article.author.name
    }
  }))
  const categoryItems = categories.map((category) => [category.title, `/category/${encodeURIComponent(category.slug)}`])
  const navItems = categoryItems.length ? [['Home', '/'], ...categoryItems] : fallbackNavItems
  const topicItems = categories.length
    ? categories.slice(0, 8).map((category) => [category.title, `/category/${encodeURIComponent(category.slug)}`])
    : fallbackTopics

  return (
    <header className="site-header">
      <div className="wallpaper-ad wallpaper-ad-left" aria-hidden="true" />
      <div className="wallpaper-ad wallpaper-ad-right" aria-hidden="true" />

      <div className="header-utility">
        <div className="container header-utility-inner">
          <span>Independen. Visioner. Untuk Indonesia.</span>
          <div>
            <Link href="/about">Tentang NNN</Link>
            <Link href="/privacy">Privasi</Link>
            <Link href="/redaksi">Redaksi</Link>
          </div>
        </div>
      </div>

      <div className="container header-brand-row">
        <Link href="/" className="brand" aria-label="Narapati News Network home">
          <span className="brand-mark">NNN</span>
          <span className="brand-sub">
            <span>Narapati</span>
            <span>News Network</span>
          </span>
        </Link>
        <div className="header-search">
          <SearchOverlay articles={searchArticles} />
        </div>
        <div className="header-account">
          <Link href="/photography">Photography</Link>
          <Link href="/video">Video</Link>
        </div>
      </div>

      <nav className="header-nav" aria-label="Main navigation">
        <div className="container header-nav-inner">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="header-topics" aria-label="Trending topics">
        <div className="container header-topics-inner">
          <span>Trending</span>
          {topicItems.map(([topic, href]) => (
            <Link key={href} href={href}>
              #{topic.replace(/\s+/g, '')}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
