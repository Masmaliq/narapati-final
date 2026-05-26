import Image from 'next/image'
import Link from 'next/link'
import {getArticles, getPhotography, getVideos} from '@/sanity/lib/fetch'
import type {Article, MediaItem} from '@/types/content'

function articleHref(slug: string) {
  return `/article/${encodeURIComponent(slug)}`
}

function mediaHref(section: 'video' | 'photography', slug: string) {
  return `/${section}/${encodeURIComponent(slug)}`
}

const monochromeImages = {
  hero: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1800&q=88',
  global: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1300&q=86',
  insight: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1300&q=86',
  video: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=86',
  photo: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=88'
}

const heroContent = {
  category: 'Insight',
  title: 'Ketika Qurban Menjadi Latihan Memotong Ego',
  description:
    '“Yang sampai kepada Allah itu bukan darah dan dagingnya, tetapi ketakwaan dan keikhlasan kita.”',
  author: 'Mas Maliq Ibrahim',
  publisher: 'Narapati News Network',
  date: '2026-05-24',
  image: monochromeImages.hero
}

const globalCopy = {
  lead: {
    title: 'Dunia Bergerak di Tengah Ketegangan Baru',
    dek: 'Peta global berubah perlahan ketika diplomasi, pasar, dan kepentingan strategis saling bertemu dalam satu ruang ketidakpastian.',
    image: monochromeImages.global
  },
  small: [
    'Diplomasi Global Memasuki Babak Baru',
    'Asia Menjadi Pusat Perhatian Ekonomi Dunia'
  ]
}

const insightStories = [
  {
    label: 'Insight',
    title: 'Di Antara Riuh Pasar dan Sunyi Hati',
    dek: 'Sebuah catatan tentang manusia yang tetap mencari makna di tengah angka, target, dan tekanan zaman.',
    image: monochromeImages.insight
  },
  {
    label: 'Kontemplasi',
    title: 'Sunyi yang Menghidupkan',
    dek: 'Kadang yang paling strategis bukan suara paling keras, melainkan kejernihan yang tumbuh perlahan.'
  },
  {
    label: 'Nilai Hidup',
    title: 'Setetes Cahaya di Jalan Pulang',
    dek: 'Tentang arah, jeda, dan keberanian untuk kembali pada nilai yang membuat hidup tetap utuh.'
  }
]

const marketRows = [
  {label: 'IHSG', value: '7,214.89', change: '+0.42%', tone: 'up'},
  {label: 'XAUUSD', value: '2,337.10', change: '-0.18%', tone: 'down'},
  {label: 'USDIDR', value: '16,255', change: '+0.21%', tone: 'up'},
  {label: 'NASDAQ', value: '17,688.88', change: '+0.63%', tone: 'up'},
  {label: 'OIL', value: '78.42', change: '-0.31%', tone: 'down'}
]

const fallbackArticles: Article[] = [
  {
    title: 'Arus Modal Global Bergerak Lebih Selektif',
    slug: 'arus-modal-global-bergerak-selektif',
    dek: 'Pasar membaca ulang risiko kawasan, kualitas institusi, dan daya tahan ekonomi riil.',
    category: {title: 'Global', slug: 'global', description: ''},
    publishedAt: '2026-05-20',
    image: monochromeImages.global,
    author: {name: 'Narapati Desk', role: 'Editorial'}
  },
  {
    title: 'Diplomasi Ekonomi Asia Memasuki Babak Baru',
    slug: 'diplomasi-ekonomi-asia-babak-baru',
    dek: 'Negara-negara Asia menata kembali rantai pasok, teknologi, dan pengaruh strategis.',
    category: {title: 'Global', slug: 'global', description: ''},
    publishedAt: '2026-05-19',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1300&q=86',
    author: {name: 'Narapati Desk', role: 'Editorial'}
  },
  {
    title: 'Kota, Modal, dan Masa Depan Kelas Menengah',
    slug: 'kota-modal-masa-depan-kelas-menengah',
    dek: 'Pertumbuhan baru akan ditentukan oleh kualitas kota, akses, dan kepercayaan publik.',
    category: {title: 'Market', slug: 'market', description: ''},
    publishedAt: '2026-05-18',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1300&q=86',
    author: {name: 'Narapati Desk', role: 'Editorial'}
  }
]

const fallbackVideos: MediaItem[] = [
  {
    title: 'Narapati Visual Journal: Membaca Zaman dalam Sunyi',
    slug: 'market-hall-ekonomi-global',
    dek: 'Editorial video tentang arah pasar, geopolitik, dan keputusan investor.',
    publishedAt: '2026-05-20',
    image: monochromeImages.video,
    duration: '12:08'
  },
  {
    title: 'Percakapan Tentang Pasar dan Manusia',
    slug: 'quiet-briefing-kepemimpinan',
    dek: 'Percakapan ringkas dari meja redaksi Narapati.',
    publishedAt: '2026-05-18',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1300&q=86',
    duration: '09:44'
  },
  {
    title: 'Catatan Malam dari Ruang Redaksi',
    slug: 'indonesia-after-hours',
    dek: 'Catatan visual tentang kota, manusia, dan perubahan.',
    publishedAt: '2026-05-16',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1300&q=86',
    duration: '07:25'
  }
]

function storyAt(stories: Article[], index: number) {
  return stories[index] || fallbackArticles[index % fallbackArticles.length]
}

export default async function HomePage() {
  const [cmsArticles, cmsVideos, cmsPhotography] = await Promise.all([
    getArticles(),
    getVideos(),
    getPhotography()
  ])

  const articles = cmsArticles.length ? cmsArticles : fallbackArticles
  const videos = cmsVideos.length ? cmsVideos : fallbackVideos
  const featured = articles.find((article) => article.slug === 'ketika-qurban-menjadi-latihan-memotong-ego') || articles.find((article) => article.featured) || articles[0] || fallbackArticles[0]
  const globalStories = [
    ...articles.filter((article) => {
      const category = `${article.category.title} ${article.category.slug}`.toLowerCase()
      return category.includes('global')
    }),
    ...articles
  ].filter((article, index, list) => list.findIndex((item) => item.slug === article.slug) === index)

  const photoFeature = cmsPhotography[0] || {
    title: 'Communist Climb',
    slug: 'communist-climb',
    dek: 'Sebuah lanskap tentang tubuh, ruang, dan ingatan kolektif yang bergerak di antara sejarah dan hari ini.',
    publishedAt: '2026-05-20',
    image: monochromeImages.photo,
    duration: 'Photo of the Day'
  }

  const heroHref = articleHref(featured.slug)
  const leadGlobal = storyAt(globalStories, 0)
  const videoLead = videos[0] || fallbackVideos[0]
  const videoList = (videos.length > 1 ? videos.slice(1, 3) : fallbackVideos.slice(1, 3))

  return (
    <>
      <section className="nnn-home">
        <div className="nnn-container">
          <section className="nnn-hero" aria-label="Featured story">
            <div className="nnn-hero-copy">
              <span>{heroContent.category}</span>
              <Link href={heroHref}>
                <h1>{heroContent.title}</h1>
              </Link>
              <p>{heroContent.description}</p>
              <div className="nnn-hero-meta">
                <span>{heroContent.author}</span>
                <time dateTime={heroContent.date}>May 24, 2026</time>
                <span>{heroContent.publisher}</span>
              </div>
              <Link className="nnn-button" href={heroHref}>BACA SELENGKAPNYA</Link>
            </div>
            <Link href={heroHref} className="nnn-hero-image" aria-label={heroContent.title}>
              <Image src={featured.image || heroContent.image} alt="" fill priority sizes="(max-width: 900px) 100vw, 60vw" />
            </Link>
          </section>

          <section className="nnn-triad" aria-label="Global Insight Market">
            <div className="nnn-column">
              <h2>Global</h2>
              <article className="nnn-column-lead">
                <Link href={articleHref(leadGlobal.slug)} className="nnn-column-image">
                  <Image src={leadGlobal.image || globalCopy.lead.image} alt="" fill sizes="(max-width: 900px) 100vw, 32vw" />
                </Link>
                <Link href={articleHref(leadGlobal.slug)}>
                  <h3>{globalCopy.lead.title}</h3>
                </Link>
                <p>{globalCopy.lead.dek}</p>
              </article>
              <div className="nnn-mini-list">
                {[storyAt(globalStories, 1), storyAt(globalStories, 2)].map((article, index) => (
                  <Link href={articleHref(article.slug)} className="nnn-mini-story" key={article.slug}>
                    <span>Global</span>
                    <strong>{globalCopy.small[index] || article.title}</strong>
                  </Link>
                ))}
              </div>
            </div>

            <div className="nnn-column">
              <h2>Insight</h2>
              <article className="nnn-column-lead">
                <div className="nnn-column-image">
                  <Image src={insightStories[0].image || monochromeImages.insight} alt="" fill sizes="(max-width: 900px) 100vw, 32vw" />
                </div>
                <h3>{insightStories[0].title}</h3>
                <p>{insightStories[0].dek}</p>
              </article>
              <div className="nnn-mini-list">
                {insightStories.slice(1).map((story) => (
                  <div className="nnn-mini-story" key={story.title}>
                    <span>{story.label}</span>
                    <strong>{story.title}</strong>
                  </div>
                ))}
              </div>
            </div>

            <aside className="nnn-market-card" aria-label="Market dashboard">
              <div className="nnn-market-heading">
                <h2>Market</h2>
              </div>
              <div className="nnn-market-tabs">
                <span>Indeks</span>
                <span>Forex</span>
                <span>Komoditas</span>
                <span>Crypto</span>
              </div>
              <div className="nnn-market-rows">
                {marketRows.map((row) => (
                  <div className="nnn-market-row" data-tone={row.tone} key={row.label}>
                    <strong>{row.label}</strong>
                    <i aria-hidden="true" />
                    <span>{row.value}</span>
                    <small>{row.change}</small>
                  </div>
                ))}
              </div>
              <Link href="/category/market">Lihat Data Pasar Lengkap</Link>
            </aside>
          </section>
        </div>
      </section>

      <section className="nnn-video-section" aria-labelledby="featured-videos-heading">
        <div className="nnn-container">
          <div className="nnn-section-top nnn-section-top-dark">
            <h2 id="featured-videos-heading">Featured Videos</h2>
          </div>
          <div className="nnn-video-layout">
            <Link href={mediaHref('video', videoLead.slug)} className="nnn-video-main">
              <Image src={videoLead.image || monochromeImages.video} alt="" fill sizes="(max-width: 900px) 100vw, 62vw" />
              <span className="nnn-play-button" aria-hidden="true">▶</span>
              <div>
                <small>{videoLead.duration || 'Video'}</small>
                <h3>{videoLead.title}</h3>
              </div>
            </Link>
            <div className="nnn-video-list">
              {videoList.map((video) => (
                <Link href={mediaHref('video', video.slug)} className="nnn-video-item" key={video.slug}>
                  <span className="nnn-video-thumb">
                    <Image src={video.image || monochromeImages.video} alt="" fill sizes="(max-width: 900px) 33vw, 360px" />
                  </span>
                  <span>
                    <small>{video.duration || 'Video'}</small>
                    <strong>{video.title}</strong>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="nnn-video-actions">
            <Link href="/video">View All Videos</Link>
          </div>
        </div>
      </section>

      <div className="nnn-section-divider" aria-hidden="true">
        <span />
      </div>

      <section className="nnn-photo-day" aria-label="Photo of the day">
        <Image src={photoFeature.image || monochromeImages.photo} alt="" fill sizes="100vw" />
        <div className="nnn-photo-overlay">
          <span>Photo of the Day</span>
          <h2>Capture The Moment, Keep The Story.</h2>
          <p>Sebuah ruang visual untuk membaca manusia, tempat, perjalanan, dan peristiwa melalui bahasa gambar yang tenang.</p>
          <Link href="/photography">See More Photos</Link>
        </div>
      </section>
    </>
  )
}
