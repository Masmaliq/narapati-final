import Image from 'next/image'
import Link from 'next/link'
import {formatDate} from '@/components/date'
import {getArticles, getCategories, getPhotography, getVideos} from '@/sanity/lib/fetch'

function articleHref(slug: string) {
  return `/article/${encodeURIComponent(slug)}`
}

function categoryHref(slug: string) {
  return `/category/${encodeURIComponent(slug)}`
}

function photographyHref(slug: string) {
  return `/photography/${encodeURIComponent(slug)}`
}

function videoHref(slug: string) {
  return `/video/${encodeURIComponent(slug)}`
}

const sponsorPartners = ['MAK Capital', 'Narapati Partner', 'Archipelago Fund', 'Meridian Advisory', 'Svara Ventures']

const homePageContent = {
  newsroom: {
    label: 'Narapati News Network',
    tagline: 'Business, leadership, and nilai hidup for modern Indonesia'
  },
  sections: {
    utama: {label: 'Top Stories', title: 'Berita Utama'},
    editorsPick: {label: 'Curated', title: "EDITOR'S PICK"},
    latest: {
      label: 'Latest News',
      title: 'Editorial Briefing',
      description: 'Fresh reporting and analysis from the Narapati newsroom.'
    },
    video: {label: 'Watch', title: 'Video', playLabel: 'Play'},
    photography: {label: 'Visual', title: 'Photography'},
    popular: {label: 'Most Read', title: 'Terpopuler'}
  },
  sidebar: {
    ariaLabel: 'Post terbaru',
    latest: {label: 'Update', title: 'POST TERBARU'},
    video: {title: 'VIDEO', linkLabel: 'Lihat'},
    photography: {title: 'PHOTOGRAPHY'},
    recommendation: {title: 'REKOMENDASI'},
    popular: {title: 'TERPOPULER'}
  },
  intelligence: {
    ariaLabel: 'NNN Intelligence Network',
    label: 'NNN Intelligence Network',
    title: 'Tentang NNN',
    description: 'Narapati News Network adalah media premium untuk kepemimpinan, bisnis, nilai hidup, dan percakapan strategis Indonesia.',
    ctaLabel: 'Partnership / Branding',
    ctaTitle: 'Bangun kolaborasi editorial dan brand storytelling bersama NNN.',
    ctaSmall: 'Hubungi kami'
  },
  sponsors: {
    ariaLabel: 'Sponsor partners',
    title: 'Premium Partners'
  },
  mobileNav: {
    ariaLabel: 'Mobile navigation',
    home: 'Home',
    photography: 'Photography',
    video: 'Video',
    fallbackCategory: 'News'
  }
}

export default async function HomePage() {
  const [articles, categories, videos, photography] = await Promise.all([
    getArticles(),
    getCategories(),
    getVideos(),
    getPhotography()
  ])
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
  const videoStories = videos.slice(0, 3)
  const photographyStories = photography.slice(0, 3)
  const recommendationStories = latest.slice(3, 7)
  const popularMainStories = popularStories.slice(0, 3)
  const mobileCategory = categories[0]

  return (
    <>
      <section className="home-newsroom">
        <div className="container">
          <div className="newsroom-bar">
            <div>
              <span>{homePageContent.newsroom.label}</span>
              <strong>{homePageContent.newsroom.tagline}</strong>
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
                  <span>{homePageContent.sections.utama.label}</span>
                  <h2 id="utama-news-heading">{homePageContent.sections.utama.title}</h2>
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
                  <span>{homePageContent.sections.editorsPick.label}</span>
                  <h2 id="editors-pick-heading">{homePageContent.sections.editorsPick.title}</h2>
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
                    <span>{homePageContent.sections.latest.label}</span>
                    <h2>{homePageContent.sections.latest.title}</h2>
                  </div>
                  <p>{homePageContent.sections.latest.description}</p>
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
                  <span>{homePageContent.sections.video.label}</span>
                  <h2 id="video-section-heading">{homePageContent.sections.video.title}</h2>
                </div>
                <div className="portal-card-grid">
                  {videoStories.map((item) => (
                    <article className="portal-media-card" key={item.slug}>
                      <Link href={videoHref(item.slug)} className="portal-media-image">
                        <Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 30vw" />
                        <span>{homePageContent.sections.video.playLabel}</span>
                      </Link>
                      <div>
                        <Link href="/video" className="home-card-kicker">
                          {item.duration || 'Video'}
                        </Link>
                        <Link href={videoHref(item.slug)}>
                          <h3>{item.title}</h3>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="portal-section" aria-labelledby="photography-section-heading">
                <div className="compact-section-heading">
                  <span>{homePageContent.sections.photography.label}</span>
                  <h2 id="photography-section-heading">{homePageContent.sections.photography.title}</h2>
                </div>
                <div className="portal-card-grid">
                  {photographyStories.map((item) => (
                    <article className="portal-media-card" key={item.slug}>
                      <Link href={photographyHref(item.slug)} className="portal-media-image">
                        <Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 30vw" />
                      </Link>
                      <div>
                        <Link href="/photography" className="home-card-kicker">
                          {item.duration || 'Photography'}
                        </Link>
                        <Link href={photographyHref(item.slug)}>
                          <h3>{item.title}</h3>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="portal-section" aria-labelledby="popular-section-heading">
                <div className="compact-section-heading">
                  <span>{homePageContent.sections.popular.label}</span>
                  <h2 id="popular-section-heading">{homePageContent.sections.popular.title}</h2>
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

            <aside className="home-ad-sidebar" aria-label={homePageContent.sidebar.ariaLabel}>
              <div className="sidebar-sticky">
                <section className="sidebar-news-card">
                  <div className="post-terbaru-heading">
                    <span>{homePageContent.sidebar.latest.label}</span>
                    <h2>{homePageContent.sidebar.latest.title}</h2>
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
                    <h2>{homePageContent.sidebar.video.title}</h2>
                    <Link href="/video">{homePageContent.sidebar.video.linkLabel}</Link>
                  </div>
                  {videoStories.map((item) => (
                    <Link className="sidebar-compact-item" href={videoHref(item.slug)} key={item.slug}>
                      <span>{item.duration || 'Video'}</span>
                      <strong>{item.title}</strong>
                    </Link>
                  ))}
                </section>

                <section className="sidebar-news-card sidebar-news-card-compact">
                  <div className="sidebar-section-heading">
                    <h2>{homePageContent.sidebar.photography.title}</h2>
                  </div>
                  {photographyStories.map((item) => (
                    <Link className="sidebar-compact-item" href={photographyHref(item.slug)} key={item.slug}>
                      <span>{item.duration || 'Photography'}</span>
                      <strong>{item.title}</strong>
                    </Link>
                  ))}
                </section>

                <section className="sidebar-news-card sidebar-news-card-compact">
                  <div className="sidebar-section-heading">
                    <h2>{homePageContent.sidebar.recommendation.title}</h2>
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
                    <h2>{homePageContent.sidebar.popular.title}</h2>
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

      <section className="nnn-intelligence-section" aria-label={homePageContent.intelligence.ariaLabel}>
        <div className="container nnn-intelligence-grid">
          <div className="nnn-intelligence-image">
            <Image src={featured.image} alt="" fill sizes="(max-width: 900px) 100vw, 34vw" />
          </div>
          <div className="nnn-intelligence-copy">
            <span>{homePageContent.intelligence.label}</span>
            <h2>{homePageContent.intelligence.title}</h2>
            <p>{homePageContent.intelligence.description}</p>
          </div>
          <Link className="nnn-intelligence-cta" href="/about">
            <span>{homePageContent.intelligence.ctaLabel}</span>
            <strong>{homePageContent.intelligence.ctaTitle}</strong>
            <small>{homePageContent.intelligence.ctaSmall}</small>
          </Link>
        </div>
      </section>

      <section className="footer-sponsor-strip" aria-label={homePageContent.sponsors.ariaLabel}>
        <div className="container">
          <span>{homePageContent.sponsors.title}</span>
          <div>
            {sponsorPartners.map((partner) => (
              <div key={partner}>{partner}</div>
            ))}
          </div>
        </div>
      </section>

      <nav className="mobile-bottom-nav" aria-label={homePageContent.mobileNav.ariaLabel}>
        <Link href="/">{homePageContent.mobileNav.home}</Link>
        <Link href={mobileCategory ? categoryHref(mobileCategory.slug) : '/category/nasional'}>
          {mobileCategory?.title || homePageContent.mobileNav.fallbackCategory}
        </Link>
        <Link href="/photography">{homePageContent.mobileNav.photography}</Link>
        <Link href="/video">{homePageContent.mobileNav.video}</Link>
      </nav>
    </>
  )
}
