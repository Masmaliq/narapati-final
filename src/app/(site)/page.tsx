import Image from 'next/image'
import Link from 'next/link'
import {ArticleCard} from '@/components/ArticleCard'
import {MediaCard} from '@/components/MediaCard'
import {formatDate} from '@/components/date'
import {getArticles, getCategories, getPodcasts, getVideos} from '@/sanity/lib/fetch'

export default async function HomePage() {
  const [articles, categories, podcasts, videos] = await Promise.all([
    getArticles(),
    getCategories(),
    getPodcasts(),
    getVideos()
  ])
  const featured = articles.find((article) => article.featured) || articles[0]
  const supporting = articles.filter((article) => article.slug !== featured.slug)
  const trending = supporting.slice(0, 4)
  const latest = supporting.slice(0, 4)
  const mainNews = articles.slice(0, 6)
  const nilaiHidupStory = supporting[2] || supporting[0] || featured
  const heroPodcast = podcasts[0]

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="edition-line">
            <span>Narapati News Network</span>
            <span>NNN / Jakarta / {formatDate(featured.publishedAt)}</span>
          </div>
          <div className="hero-grid">
            <article className="hero-card">
              <Link href={`/article/${featured.slug}`} className="hero-image">
                <Image src={featured.image} alt="" fill priority sizes="(max-width: 900px) 100vw, 64vw" />
              </Link>
              <div className="hero-copy">
                <div className="eyebrow">Nilai Hidup / {featured.category.title}</div>
                <Link href={`/article/${featured.slug}`}>
                  <h1 className="headline">{featured.title}</h1>
                </Link>
                <p className="dek">{featured.dek}</p>
                <div className="meta hero-meta">{featured.author.name} / {formatDate(featured.publishedAt)}</div>
              </div>
            </article>
            <aside className="podcast-rail" aria-label="Featured podcast">
              <div className="rail-kicker">Podcast</div>
              <div className="podcast-feature">
                <div className="podcast-art">
                  <Image src={heroPodcast.image} alt="" fill sizes="(max-width: 900px) 100vw, 28vw" />
                </div>
                <div className="eyebrow">{heroPodcast.duration}</div>
                <h2>{heroPodcast.title}</h2>
                <p>{heroPodcast.dek}</p>
                <Link href="/podcast" className="text-link">Listen now</Link>
              </div>
            </aside>
          </div>
          <div className="story-strip" aria-label="Top stories">
            <div className="rail-kicker">Top Stories</div>
            <div className="story-strip-grid">
              {trending.map((article, index) => (
                <article className="brief-card" key={article.slug}>
                  <span className="brief-number">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="eyebrow">{article.category.title}</div>
                    <Link href={`/article/${article.slug}`}>
                      <h2>{article.title}</h2>
                    </Link>
                    <div className="meta hero-meta">{formatDate(article.publishedAt)}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <nav className="category-nav" aria-label="Category navigation">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                {category.title}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="section nilai-section">
        <div className="container">
          <div className="nilai-panel">
            <div className="nilai-copy">
              <div className="eyebrow">DNA Narapati</div>
              <h2>Nilai Hidup</h2>
              <p>
                Narapati membaca berita sebagai bagian dari nilai hidup: kebijaksanaan, tanggung jawab, kepemimpinan, budaya, dan keputusan sehari-hari yang membentuk masa depan.
              </p>
            </div>
            <ArticleCard article={nilaiHidupStory} variant="compact" />
          </div>
        </div>
      </section>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <Link href="/">Home</Link>
        <Link href="/category/nasional">News</Link>
        <Link href="/podcast">Podcast</Link>
        <Link href="/video">Video</Link>
      </nav>

      <section className="section latest-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="eyebrow">Berita Utama</div>
              <h2 className="section-title">Pilihan Redaksi</h2>
            </div>
            <p className="section-note">Laporan utama, analisis, dan cerita yang memberi konteks untuk pembaca modern Indonesia.</p>
          </div>
          <div className="latest-grid">
            {latest.map((article, index) => (
              <ArticleCard key={article.slug} article={article} variant={index === 0 ? 'feature' : 'standard'} />
            ))}
          </div>
        </div>
      </section>

      <section className="section category-band">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="eyebrow">Kategori</div>
              <h2 className="section-title">Ruang Baca</h2>
            </div>
            <p className="section-note">Kanal editorial untuk mengikuti politik, dunia, bisnis, budaya, dan percakapan publik.</p>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="category-tile">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section utama-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="eyebrow">Newsroom</div>
              <h2 className="section-title">Berita Utama</h2>
            </div>
            <p className="section-note">Susunan berita yang dirancang untuk cepat dipindai, tetapi tetap terasa berkelas dan mendalam.</p>
          </div>
          <div className="grid-3">
            {mainNews.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="section media-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="eyebrow">Podcast</div>
              <h2 className="section-title">Suara Narapati</h2>
            </div>
            <p className="section-note">Percakapan editorial, briefing mingguan, dan refleksi nilai hidup untuk menemani pembaca bergerak.</p>
          </div>
          <div className="grid-2">
            {podcasts.slice(0, 2).map((item) => (
              <MediaCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section video-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="eyebrow">Video</div>
              <h2 className="section-title">Visual Report</h2>
            </div>
            <p className="section-note">Dispatch lapangan dan wawancara studio dengan ritme visual yang bersih dan premium.</p>
          </div>
          <div className="grid-2">
            {videos.slice(0, 2).map((item) => (
              <MediaCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
