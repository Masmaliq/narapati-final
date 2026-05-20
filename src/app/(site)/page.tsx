import Image from 'next/image'
import Link from 'next/link'
import {formatDate} from '@/components/date'
import {getArticles, getCategories} from '@/sanity/lib/fetch'

function articleHref(slug: string) {
  return `/article/${encodeURIComponent(slug)}`
}

function categoryHref(slug: string) {
  return `/category/${encodeURIComponent(slug)}`
}

function AdSlot({size, label, tall = false}: {size: string; label: string; tall?: boolean}) {
  return (
    <div className={`premium-ad ${tall ? 'premium-ad-tall' : ''}`}>
      <span>Strategic Partner</span>
      <strong>{label}</strong>
      <small>{size}</small>
    </div>
  )
}

const sponsorPartners = ['MAK Capital', 'Narapati Partner', 'Archipelago Fund', 'Meridian Advisory', 'Svara Ventures']

export default async function HomePage() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()])
  const featured = articles.find((article) => article.featured) || articles[0]
  const supporting = articles.filter((article) => article.slug !== featured.slug)
  const secondary = supporting.slice(0, 4)
  const latest = [...supporting.slice(4), ...articles].filter((article, index, list) => (
    list.findIndex((item) => item.slug === article.slug) === index && article.slug !== featured.slug
  )).slice(0, 8)
  const sidebarStories = supporting.slice(0, 5)
  const mobileCategory = categories[0]

  return (
    <>
      <section className="top-ad-section" aria-label="Sponsored">
        <div className="container">
          <AdSlot size="970 x 250" label="Leadership Intelligence" />
        </div>
      </section>

      <section className="home-newsroom">
        <div className="container">
          <div className="newsroom-bar">
            <div>
              <span>Narapati News Network</span>
              <strong>Business, leadership, and nilai hidup for modern Indonesia</strong>
            </div>
            <nav aria-label="Homepage categories">
              {categories.slice(0, 5).map((category) => (
                <Link key={category.slug} href={categoryHref(category.slug)}>
                  {category.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="home-editorial-layout">
            <main className="home-main">
              <article className="premium-hero-card">
                <Link href={articleHref(featured.slug)} className="premium-hero-image">
                  <Image src={featured.image} alt="" fill priority sizes="(max-width: 980px) 100vw, 62vw" />
                </Link>
                <div className="premium-hero-copy">
                  <Link href={categoryHref(featured.category.slug)} className="home-category-pill">
                    {featured.category.title}
                  </Link>
                  <Link href={articleHref(featured.slug)}>
                    <h1>{featured.title}</h1>
                  </Link>
                  <p>{featured.dek}</p>
                  <div className="home-meta">
                    <span>{featured.author.name}</span>
                    <span>{formatDate(featured.publishedAt)}</span>
                  </div>
                </div>
              </article>

              <section className="secondary-news-grid" aria-label="Secondary articles">
                {secondary.map((article) => (
                  <article className="editorial-card" key={article.slug}>
                    <Link href={articleHref(article.slug)} className="editorial-card-image">
                      <Image src={article.image} alt="" fill sizes="(max-width: 760px) 100vw, 25vw" />
                    </Link>
                    <div>
                      <Link href={categoryHref(article.category.slug)} className="home-card-kicker">
                        {article.category.title}
                      </Link>
                      <Link href={articleHref(article.slug)}>
                        <h2>{article.title}</h2>
                      </Link>
                      <p>{article.dek}</p>
                      <div className="home-meta">{formatDate(article.publishedAt)}</div>
                    </div>
                  </article>
                ))}
              </section>

              <section className="inline-sponsor" aria-label="Strategic partner">
                <div>
                  <span>Strategic Partner</span>
                  <h2>Insight for Indonesia’s next business leaders</h2>
                  <p>Premium thought leadership placement for institutions shaping capital, governance, and sustainable growth.</p>
                </div>
                <Link href="/about">Explore Partnership</Link>
              </section>

              <section className="latest-news-section">
                <div className="home-section-heading">
                  <div>
                    <span>Latest News</span>
                    <h2>Editorial Briefing</h2>
                  </div>
                  <p>Fresh reporting and analysis from the Narapati newsroom.</p>
                </div>
                <div className="latest-news-grid">
                  {latest.map((article) => (
                    <article className="latest-news-card" key={article.slug}>
                      <Link href={articleHref(article.slug)} className="latest-news-image">
                        <Image src={article.image} alt="" fill sizes="(max-width: 760px) 100vw, 22vw" />
                      </Link>
                      <div>
                        <Link href={categoryHref(article.category.slug)} className="home-card-kicker">
                          {article.category.title}
                        </Link>
                        <Link href={articleHref(article.slug)}>
                          <h3>{article.title}</h3>
                        </Link>
                        <div className="home-meta">{article.author.name} / {formatDate(article.publishedAt)}</div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </main>

            <aside className="home-ad-sidebar" aria-label="Premium sponsors">
              <div className="sidebar-sticky">
                <AdSlot size="300 x 250" label="Market Brief" />
                <AdSlot size="300 x 600" label="Executive Agenda" tall />
                <div className="sidebar-editors">
                  <span>Editor’s Watch</span>
                  {sidebarStories.map((article) => (
                    <Link href={articleHref(article.slug)} key={article.slug}>
                      {article.title}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="footer-sponsor-strip" aria-label="Sponsor partners">
        <div className="container">
          <span>Premium Partners</span>
          <div>
            {sponsorPartners.map((partner) => (
              <div key={partner}>{partner}</div>
            ))}
          </div>
        </div>
      </section>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <Link href="/">Home</Link>
        <Link href={mobileCategory ? categoryHref(mobileCategory.slug) : '/category/nasional'}>{mobileCategory?.title || 'News'}</Link>
        <Link href="/podcast">Podcast</Link>
        <Link href="/video">Video</Link>
      </nav>
    </>
  )
}
