import Image from 'next/image'
import Link from 'next/link'
import {SearchOverlay, type SearchArticle} from '@/components/SearchOverlay'
import {breakingInsightItems} from '@/content/ticker'
import {getArticles, getCategories} from '@/sanity/lib/fetch'

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
  const navItems = [
    ['Home', '/'],
    ...categories.map((category) => [
      category.title,
      `/category/${encodeURIComponent(category.slug)}`
    ])
  ]
  const insightItems = articles.length
    ? articles.slice(0, 6).map((article) => article.title)
    : breakingInsightItems
  const insightLoop = [...insightItems, ...insightItems]

  return (
    <header className="site-header">
      <div className="wallpaper-ad wallpaper-ad-left" aria-hidden="true" />
      <div className="wallpaper-ad wallpaper-ad-right" aria-hidden="true" />

      <div className="container header-brand-row">
        <Link href="/" className="brand" aria-label="Narapati News Network home">
          <Image
            className="brand-logo"
            src="/brand/narapati-logo-transparent.png"
            alt="Narapati News Network"
            width={1536}
            height={300}
            priority
          />
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

      <div className="header-topics" aria-label="Breaking insight topics">
        <div className="container header-topics-inner">
          <span>Breaking Insight</span>
          <div className="header-insight-viewport">
            <div className="header-insight-track">
              {insightLoop.map((headline, index) => (
                <span className="header-insight-item" key={`${headline}-${index}`}>
                  {headline}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
