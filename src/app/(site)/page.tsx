import Image from 'next/image'
import Link from 'next/link'
import {JournalHeroCarousel, type JournalHeroSlide} from '@/components/JournalHeroCarousel'
import {WatermarkedImage} from '@/components/WatermarkedImage'
import {getArticles, getCategories, getHomepageSettings, getPhotography, getVideos} from '@/sanity/lib/fetch'
import type {Article, HomepageSectionKey, PhotographyItem} from '@/types/content'

function articleHref(slug: string) {
  return `/article/${encodeURIComponent(slug)}`
}

function mediaHref(section: 'video' | 'photography', slug: string) {
  return `/${section}/${encodeURIComponent(slug)}`
}

function formatDate(value?: string) {
  if (!value) return 'Narapati'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))
}

function readingTime(article?: Article) {
  const seed = article?.body?.length || article?.dek?.length || article?.title?.length || 240
  return `${Math.max(3, Math.min(9, Math.ceil(seed / 180)))} menit baca`
}

function categoryOf(article?: Article) {
  return article?.category?.title || 'Journal'
}

function authorOf(article?: Article) {
  return article?.author?.name || 'Narapati'
}

function pickByCategory(articles: Article[], label: string) {
  const needle = label.toLowerCase()
  return articles.filter((article) => {
    const category = `${article.category?.title || ''} ${article.category?.slug || ''}`.toLowerCase()
    return category.includes(needle)
  })
}

function uniqueArticles(items: Article[]) {
  return items.filter((article, index, list) => list.findIndex((item) => item.slug === article.slug) === index)
}

function fillItems<T>(source: T[], count: number) {
  if (!source.length) return []

  const filled = [...source]
  while (filled.length < count) {
    filled.push(source[filled.length % source.length])
  }
  return filled.slice(0, count)
}

const defaultSectionOrder: HomepageSectionKey[] = [
  'hero',
  'journal',
  'featured',
  'insight',
  'market',
  'photography',
  'video'
]
function selectedItems<T extends {slug: string}>(items?: T[]) {
  return Array.isArray(items) ? items.filter((item) => item?.slug) : []
}

export default async function HomePage() {
  const [articles, videos, photography, homepageSettings, categories] = await Promise.all([
    getArticles(),
    getVideos(),
    getPhotography(),
    getHomepageSettings(),
    getCategories()
  ])

  const availableArticles = articles.filter((article) => article.slug)
  const featured = homepageSettings?.heroArticle?.slug || homepageSettings?.featuredArticle?.slug
    ? homepageSettings.heroArticle || homepageSettings.featuredArticle || availableArticles[0]
    : availableArticles.find((article) => article.featured) || availableArticles[0]
  const articlesAfterHero = availableArticles.filter((article) => article.slug !== featured?.slug)
  const articlePool = articlesAfterHero.length ? articlesAfterHero : availableArticles
  const sectionSettings = homepageSettings?.sectionOrder?.length ? homepageSettings.sectionOrder : defaultSectionOrder.map((section) => ({section, visible: true}))
  const sectionVisible = (section: HomepageSectionKey) => sectionSettings.find((item) => item.section === section)?.visible !== false
  const articleCategories = categories.filter((category) => category.slug && category.title)
  const heroArticleSlides: JournalHeroSlide[] = uniqueArticles([
    ...(featured ? [featured] : []),
    ...articlePool.filter((article) => article.image)
  ]).slice(0, 3).map((article) => ({
    kind: 'article',
    title: article.title,
    slug: article.slug,
    dek: article.dek,
    image: article.image,
    publishedAt: article.publishedAt,
    href: articleHref(article.slug),
    label: categoryOf(article),
    source: authorOf(article)
  }))
  const heroPhotoSlides: JournalHeroSlide[] = photography.filter((photo) => photo.slug && photo.image).slice(0, 1).map((photo) => ({
    kind: 'photography',
    title: photo.title,
    slug: photo.slug,
    dek: photo.dek,
    image: photo.image,
    publishedAt: photo.publishedAt,
    href: mediaHref('photography', photo.slug),
    label: 'Visual Journal',
    source: photo.location || photo.duration || 'Narapati Photography'
  }))
  const heroVideoSlides: JournalHeroSlide[] = videos.filter((video) => video.slug && video.image).slice(0, 1).map((video) => ({
    kind: 'video',
    title: video.title,
    slug: video.slug,
    dek: video.dek,
    image: video.image,
    publishedAt: video.publishedAt,
    href: mediaHref('video', video.slug),
    label: 'Video Journal',
    source: 'Narapati Video',
    duration: video.duration
  }))
  const heroSlides = [
    ...heroArticleSlides.slice(0, 1),
    ...heroPhotoSlides,
    ...heroVideoSlides,
    ...heroArticleSlides.slice(1)
  ].slice(0, 5)
  const latestArticles = fillItems(
    uniqueArticles(selectedItems(homepageSettings?.journalArticles).length ? selectedItems(homepageSettings?.journalArticles) : articlePool),
    3
  )
  const managedFeaturedArticle = homepageSettings?.featuredArticle?.slug ? homepageSettings.featuredArticle : null
  const topStories = fillItems(
    uniqueArticles([
      ...(managedFeaturedArticle ? [managedFeaturedArticle] : []),
      ...availableArticles.filter((article) => article.featured && article.slug !== featured?.slug && article.slug !== managedFeaturedArticle?.slug),
      ...articlePool
    ]),
    3
  )
  const travelNotes = fillItems(
    uniqueArticles([
      ...pickByCategory(availableArticles, 'insight'),
      ...pickByCategory(availableArticles, 'market'),
      ...availableArticles
    ]).filter((article) => articlePool.some((item) => item.slug === article.slug)),
    3
  )
  const managedCategoryArticles = {
    insight: selectedItems(homepageSettings?.insightArticles),
    market: selectedItems(homepageSettings?.marketArticles)
  }
  const journalColumns = articleCategories.map((category) => {
    const key = category.slug.toLowerCase()
    const fallbackStories = fillItems([
      ...pickByCategory(availableArticles, category.slug),
      ...pickByCategory(availableArticles, category.title)
    ], 1)
    const managedStories = managedCategoryArticles[key as keyof typeof managedCategoryArticles] || []
    return {
      key,
      title: category.title,
      article: (managedStories.length ? managedStories : fallbackStories)[0]
    }
  }).filter((column) => column.article)
  const managedPhotography = selectedItems(homepageSettings?.photographyItems)
  const managedVideos = selectedItems(homepageSettings?.videoItems)
  const photoItems = managedPhotography.length ? managedPhotography.slice(0, 4) : fillItems(photography as PhotographyItem[], 4)
  const videoItems = managedVideos.length ? managedVideos : videos
  const videoLead = videoItems[0]
  const videoList = videoItems.slice(1, 4)

  if (!featured) {
    return (
      <main className="journal-home">
        <section className="journal-empty nnn-container">
          <p>Narapati belum memiliki artikel terbit untuk ditampilkan.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="journal-home">
      {sectionVisible('hero') ? <JournalHeroCarousel slides={heroSlides} /> : null}

      {sectionVisible('journal') ? (
      <section className="journal-section journal-section-first nnn-container" aria-labelledby="latest-heading">
        <div className="journal-section-head journal-section-head-split">
          <span id="latest-heading">Journal</span>
        </div>
        <div className="journal-latest-grid">
          {latestArticles.map((article, index) => (
            <article className="journal-card" key={`${article.slug}-${index}`}>
              {article.image ? (
                <Link href={articleHref(article.slug)} className="journal-card-image">
                  <WatermarkedImage src={article.image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
                </Link>
              ) : null}
              <div>
                <span>{categoryOf(article)}</span>
                <Link href={articleHref(article.slug)}>
                  <h3>{article.title}</h3>
                </Link>
                <p>{article.dek}</p>
                <small>{authorOf(article)} · {formatDate(article.publishedAt)}</small>
                <Link className="journal-read" href={articleHref(article.slug)}>Baca →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      ) : null}

      {sectionVisible('featured') ? (
      <section className="journal-section journal-story-section nnn-container" aria-label="Top stories dan catatan perjalanan">
        <div className="journal-top-story">
          <div className="journal-section-head journal-section-head-featured">
            <span>Featured</span>
          </div>
          {topStories[0] ? (
            <article className="journal-feature-row">
              <div>
                <span className="journal-eyebrow">{categoryOf(topStories[0])}</span>
                <Link href={articleHref(topStories[0].slug)}>
                  <h3>{topStories[0].title}</h3>
                </Link>
                <p>{topStories[0].dek}</p>
                <small>{authorOf(topStories[0])} · {readingTime(topStories[0])}</small>
              </div>
              {topStories[0].image ? (
                <Link href={articleHref(topStories[0].slug)} className="journal-feature-image">
                  <WatermarkedImage src={topStories[0].image} alt="" fill sizes="(max-width: 900px) 100vw, 44vw" />
                </Link>
              ) : null}
            </article>
          ) : null}
        </div>

        <aside className="journal-travel-notes" aria-labelledby="travel-heading">
          <div className="journal-section-head compact">
            <span id="travel-heading">Catatan Perjalanan</span>
          </div>
          <div className="journal-note-list">
            {travelNotes.map((article, index) => (
              <Link href={articleHref(article.slug)} className="journal-note" key={`${article.slug}-note-${index}`}>
                {article.image ? (
                  <span className="journal-note-image">
                    <WatermarkedImage src={article.image} alt="" fill sizes="120px" />
                  </span>
                ) : null}
                <span>
                  <small>{categoryOf(article)} · {formatDate(article.publishedAt)}</small>
                  <strong>{article.title}</strong>
                  <em>Baca →</em>
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </section>
      ) : null}

      {journalColumns.length ? (
      <section className="journal-section journal-category-section nnn-container" aria-label="Homepage category articles">
        <div className="journal-category-grid">
          {journalColumns.map(({title, article}, index) => article ? (
            <article className="journal-category-card" key={`${title}-${article.slug}-${index}`}>
              <span>{title}</span>
              {article.image ? (
                <Link href={articleHref(article.slug)} className="journal-category-image">
                  <WatermarkedImage src={article.image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
                </Link>
              ) : null}
              <Link href={articleHref(article.slug)}>
                <h3>{article.title}</h3>
              </Link>
              <p>{article.dek}</p>
              <small>{authorOf(article)} · {readingTime(article)}</small>
              <Link className="journal-read" href={articleHref(article.slug)}>Baca →</Link>
            </article>
          ) : null)}
        </div>
      </section>
      ) : null}

      {sectionVisible('photography') && photoItems.length ? (
        <section className="journal-visual" aria-labelledby="visual-heading">
          <div className="nnn-container">
            <div className="journal-dark-head">
              <div>
                <span>Photography</span>
                <h2 id="visual-heading">Visual Journal</h2>
              </div>
              <Link href="/photography">Lihat Semua →</Link>
            </div>
            <div className="journal-photo-grid">
              {photoItems.map((photo, index) => (
                <Link href={mediaHref('photography', photo.slug)} className="journal-photo-card" key={`${photo.slug}-${index}`}>
                  {photo.image ? (
                    <WatermarkedImage src={photo.image} alt="" fill sizes="(max-width: 900px) 100vw, 25vw" watermark="moment" />
                  ) : null}
                  <span>
                    <small>{photo.location || photo.duration || formatDate(photo.publishedAt)}</small>
                    <strong>{photo.title}</strong>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {sectionVisible('video') && videoLead ? (
        <section className="journal-section journal-video-journal nnn-container" aria-labelledby="video-heading">
          <div className="journal-section-head">
            <span id="video-heading">Video</span>
          </div>
          <div className="journal-video-grid">
            <Link href={mediaHref('video', videoLead.slug)} className="journal-video-main">
              {videoLead.image ? <Image src={videoLead.image} alt="" fill sizes="(max-width: 900px) 100vw, 44vw" /> : null}
              <span aria-hidden="true">▶</span>
            </Link>
            <div className="journal-video-copy">
              <small>{videoLead.duration || 'Video'}</small>
              <h3>{videoLead.title}</h3>
              <p>{videoLead.dek}</p>
              <Link className="journal-button" href={mediaHref('video', videoLead.slug)}>Tonton Sekarang</Link>
            </div>
            <div className="journal-video-list">
              {videoList.map((video) => (
                <Link href={mediaHref('video', video.slug)} key={video.slug}>
                  {video.image ? (
                    <span>
                      <Image src={video.image} alt="" fill sizes="140px" />
                    </span>
                  ) : null}
                  <b>{video.title}</b>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}
