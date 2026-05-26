import Image from 'next/image'
import Link from 'next/link'
import {SearchOverlay, type SearchArticle} from '@/components/SearchOverlay'
import {getArticles, getCategories} from '@/sanity/lib/fetch'

const breakingInsightQuotes = [
  'Pasar bergerak cepat, tetapi hati manusia tetap mencari makna.',
  'Di tengah riuh dunia, manusia tetap membutuhkan ruang sunyi.',
  'Krisis sering melahirkan kesadaran baru.',
  'Tidak semua pertumbuhan terlihat oleh mata.',
  'Market bergerak karena angka, manusia bergerak karena harapan.'
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
  const navItems = ['Global', 'Insight', 'Market', 'Video', 'Photography'].map((label) => {
    const category = categories.find((item) => item.title.toLowerCase() === label.toLowerCase())
    if (label === 'Video') return [label, '/video']
    if (label === 'Photography') return [label, '/photography']
    return [
      label,
      category ? `/category/${encodeURIComponent(category.slug)}` : `/category/${label.toLowerCase()}`
    ]
  })
  const today = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date())

  return (
    <header className="site-header">
      <div className="container header-brand-row">
        <div className="header-left-tools">
          <button className="header-menu-button" type="button" aria-label="Open menu">
            <span />
            <span />
          </button>
          <div className="header-search">
            <SearchOverlay articles={searchArticles} />
          </div>
        </div>

        <Link href="/" className="brand" aria-label="Narapati Journal home">
          <Image
            className="brand-logo"
            src="/brand/narapati-logo-transparent.png"
            alt="Narapati - Journal of a Modern Wanderer"
            width={1536}
            height={300}
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
          {navItems.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
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
