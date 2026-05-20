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

const sponsorPartners = ['MAK Capital', 'Narapati Partner', 'Archipelago Fund', 'Meridian Advisory', 'Svara Ventures']

export default async function HomePage() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()])
  const featured = articles.find((article) => article.featured) || articles[0]
  const supporting = articles.filter((article) => article.slug !== featured.slug)
  const secondary = supporting.slice(0, 4)
  const latest = [...supporting.slice(4), ...articles].filter((article, index, list) => (
    list.findIndex((item) => item.slug === article.slug) === index && article.slug !== featured.slug
  )).slice(0, 8)
  const editorsPick = [
    ...articles.filter((article) => article.featured && article.slug !== featured.slug),
    ...supporting
  ].filter((article, index, list) => list.findIndex((item) => item.slug === article.slug) === index).slice(0, 3)
  const sidebarStories = articles.slice(0, 5)
  const popularStories = supporting.slice(0, 4)
  const videoStories = latest.slice(0, 3)
  const photographyStories = [
    ...articles.filter((article) => /foto|photo|visual|photography/i.test(article.category.title)),
    ...articles
  ].filter((article, index, list) => list.findIndex((item) => item.slug === article.slug) === index).slice(0, 3)
  const podcastStories = editorsPick.slice(0, 3)
  const recommendationStories = latest.slice(3, 7)
  const popularMainStories = popularStories.slice(0, 3)
  const mobileCategory = categories[0]

  return (
    <>
      <section className="home-newsroom">
        <div className="container">
          <div className="newsroom-bar">
            <div>
              <span>Narapati News Network</span>
              <strong>Business, leadership, and nilai hidup for modern Indonesia</strong>
            </div>
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

              <section className="utama-news-section" aria-labelledby="utama-news-heading">
                <div className="compact-section-heading">
                  <span>Top Stories</span>
                  <h2 id="utama-news-heading">Berita Utama</h2>
                </div>
                <div className="secondary-news-grid">
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
                </div>
              </section>

              <section className="editors-pick-section" aria-labelledby="editors-pick-heading">
                <div className="compact-section-heading">
                  <span>Curated</span>
                  <h2 id="editors-pick-heading">EDITOR&apos;S PICK</h2>
                </div>
                <div className="editors-pick-grid">
                  {editorsPick.map((article) => (
                    <article className="editors-pick-card" key={article.slug}>
                      <Link href={articleHref(article.slug)} className="editors-pick-image">
                        <Image src={article.image} alt="" fill sizes="(max-width: 760px) 96px, 120px" />
                      </Link>
                      <div>
                        <Link href={categoryHref(article.category.slug)} className="home-card-kicker">
                          {article.category.title}
                        </Link>
                        <Link href={articleHref(article.slug)}>
                          <h3>{article.title}</h3>
                        </Link>
                        <p>{article.dek}</p>
                      </div>
                    </article>
                  ))}
                </div>
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

              <section className="portal-section" aria-labelledby="video-section-heading">
                <div className="compact-section-heading">
                  <span>Watch</span>
                  <h2 id="video-section-heading">Video</h2>
                </div>
                <div className="portal-card-grid">
                  {videoStories.map((article) => (
                    <article className="portal-media-card" key={article.slug}>
                      <Link href={articleHref(article.slug)} className="portal-media-image">
                        <Image src={article.image} alt="" fill sizes="(max-width: 760px) 100vw, 30vw" />
                        <span>Play</span>
                      </Link>
                      <div>
                        <Link href={categoryHref(article.category.slug)} className="home-card-kicker">
                          {article.category.title}
                        </Link>
                        <Link href={articleHref(article.slug)}>
                          <h3>{article.title}</h3>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="portal-section" aria-labelledby="photography-section-heading">
                <div className="compact-section-heading">
                  <span>Visual</span>
                  <h2 id="photography-section-heading">Photography</h2>
                </div>
                <div className="portal-card-grid">
                  {photographyStories.map((article) => (
                    <article className="portal-media-card" key={article.slug}>
                      <Link href={articleHref(article.slug)} className="portal-media-image">
                        <Image src={article.image} alt="" fill sizes="(max-width: 760px) 100vw, 30vw" />
                      </Link>
                      <div>
                        <Link href={categoryHref(article.category.slug)} className="home-card-kicker">
                          {article.category.title}
                        </Link>
                        <Link href={articleHref(article.slug)}>
                          <h3>{article.title}</h3>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="portal-section" aria-labelledby="podcast-section-heading">
                <div className="compact-section-heading">
                  <span>Audio</span>
                  <h2 id="podcast-section-heading">Podcast</h2>
                </div>
                <div className="podcast-strip">
                  {podcastStories.map((article) => (
                    <Link className="podcast-strip-item" href={articleHref(article.slug)} key={article.slug}>
                      <span>{article.category.title}</span>
                      <strong>{article.title}</strong>
                      <small>{formatDate(article.publishedAt)}</small>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="portal-section" aria-labelledby="popular-section-heading">
                <div className="compact-section-heading">
                  <span>Most Read</span>
                  <h2 id="popular-section-heading">Terpopuler</h2>
                </div>
                <div className="popular-main-list">
                  {popularMainStories.map((article, index) => (
                    <Link className="popular-main-item" href={articleHref(article.slug)} key={article.slug}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{article.title}</strong>
                      <small>{article.category.title}</small>
                    </Link>
                  ))}
                </div>
              </section>
            </main>

            <aside className="home-ad-sidebar" aria-label="Post terbaru">
              <div className="sidebar-sticky">
                <section className="sidebar-news-card">
                  <div className="post-terbaru-heading">
                    <span>Update</span>
                    <h2>POST TERBARU</h2>
                  </div>
                  {sidebarStories.map((article) => (
                    <Link className="post-terbaru-item" href={articleHref(article.slug)} key={article.slug}>
                      <span>{article.category.title}</span>
                      <strong>{article.title}</strong>
                      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                    </Link>
                  ))}
                </section>

                <section className="sidebar-news-card sidebar-news-card-compact">
                  <div className="sidebar-section-heading">
                    <h2>VIDEO</h2>
                    <Link href="/video">Lihat</Link>
                  </div>
                  {videoStories.map((article) => (
                    <Link className="sidebar-compact-item" href={articleHref(article.slug)} key={article.slug}>
                      <span>{article.category.title}</span>
                      <strong>{article.title}</strong>
                    </Link>
                  ))}
                </section>

                <section className="sidebar-news-card sidebar-news-card-compact">
                  <div className="sidebar-section-heading">
                    <h2>PHOTOGRAPHY</h2>
                  </div>
                  {photographyStories.map((article) => (
                    <Link className="sidebar-compact-item" href={articleHref(article.slug)} key={article.slug}>
                      <span>{article.category.title}</span>
                      <strong>{article.title}</strong>
                    </Link>
                  ))}
                </section>

                <section className="sidebar-news-card sidebar-news-card-compact">
                  <div className="sidebar-section-heading">
                    <h2>REKOMENDASI</h2>
                  </div>
                  {recommendationStories.map((article) => (
                    <Link className="sidebar-compact-item" href={articleHref(article.slug)} key={article.slug}>
                      <span>{article.category.title}</span>
                      <strong>{article.title}</strong>
                    </Link>
                  ))}
                </section>

                <section className="sidebar-news-card sidebar-news-card-compact">
                  <div className="sidebar-section-heading">
                    <h2>TERPOPULER</h2>
                  </div>
                  {popularStories.map((article, index) => (
                    <Link className="sidebar-ranked-item" href={articleHref(article.slug)} key={article.slug}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{article.title}</strong>
                    </Link>
                  ))}
                </section>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="nnn-intelligence-section" aria-label="NNN Intelligence Network">
        <div className="container nnn-intelligence-grid">
          <div className="nnn-intelligence-image">
            <Image src={featured.image} alt="" fill sizes="(max-width: 900px) 100vw, 34vw" />
          </div>
          <div className="nnn-intelligence-copy">
            <span>NNN Intelligence Network</span>
            <h2>Tentang NNN</h2>
            <p>Narapati News Network adalah media premium untuk kepemimpinan, bisnis, nilai hidup, dan percakapan strategis Indonesia.</p>
          </div>
          <Link className="nnn-intelligence-cta" href="/about">
            <span>Partnership / Branding</span>
            <strong>Bangun kolaborasi editorial dan brand storytelling bersama NNN.</strong>
            <small>Hubungi kami</small>
          </Link>
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
