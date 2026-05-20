import Link from 'next/link'
import {SearchOverlay, type SearchArticle} from '@/components/SearchOverlay'
import {getArticles} from '@/sanity/lib/fetch'

const navItems = [
  ['Nasional', '/category/nasional'],
  ['Global', '/category/global'],
  ['Business', '/category/business'],
  ['Culture', '/category/culture'],
  ['Podcast', '/podcast'],
  ['Video', '/video']
]

export async function Header() {
  const articles = await getArticles()
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

  return (
    <header className="site-header">
      <div className="container topbar">
        <Link href="/" className="brand" aria-label="Narapati News Network home">
          <span className="brand-mark">NNN</span>
          <span className="brand-sub">
            <span>Narapati</span>
            <span>News Network</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
          <Link href="/about">About</Link>
          <SearchOverlay articles={searchArticles} />
        </nav>
      </div>
    </header>
  )
}
