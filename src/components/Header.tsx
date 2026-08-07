import Image from 'next/image'
import Link from 'next/link'
import {MobileMenu} from '@/components/MobileMenu'
import {SearchOverlay, type SearchArticle} from '@/components/SearchOverlay'
import {getArticles, getNavigationItems} from '@/sanity/lib/fetch'

const breakingInsightQuotes = [
  'Pasar bergerak cepat, tetapi hati manusia tetap mencari makna.',
  'Di tengah riuh dunia, manusia tetap membutuhkan ruang sunyi.',
  'Krisis sering melahirkan kesadaran baru.',
  'Tidak semua pertumbuhan terlihat oleh mata.',
  'Market bergerak karena angka, manusia bergerak karena harapan.'
]

export async function Header() {
  const [articles, navItems] = await Promise.all([getArticles(), getNavigationItems()])
  const searchArticles: SearchArticle[] = articles.map((article) => ({
    title: article.title,
    slug: article.slug,
    dek: article.dek,
    bodyText: article.bodyText,
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
  const today = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date())

  return (
    <header className="site-header">
      <div className="container header-brand-row">
        <div className="header-left-tools">
          <MobileMenu navItems={navItems} />
          <div className="header-search">
            <SearchOverlay articles={searchArticles} />
          </div>
        </div>

        <Link href="/" className="brand" aria-label="Narapati Journal home">
          <Image
            className="brand-logo"
            src="/brand/narapati-logo-journal.png"
            alt="Narapati - Journal of a Modern Wanderer"
            width={1429}
            height={248}
            priority
          />
        </Link>

        <div className="header-account">
          <time dateTime={new Date().toISOString()}>{today}</time>
          <span>ID</span>
        </div>
      </div>

      <nav className="header-nav" aria-label="Main navigation">
        <div className="container header-nav-inner">
          {navItems.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className={item.highlight ? 'header-nav-highlight' : undefined}
              target={item.openInNewTab ? '_blank' : undefined}
              rel={item.openInNewTab ? 'noreferrer' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="header-topics" aria-label="Breaking insight">
        <div className="container header-topics-inner">
          <span>Breaking Insight :</span>
          <div className="header-insight-viewport">
            <div className="header-insight-track">
              {[...breakingInsightQuotes, ...breakingInsightQuotes].map((quote, index) => (
                <span className="header-insight-item" key={`${quote}-${index}`}>
                  “{quote}”
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
