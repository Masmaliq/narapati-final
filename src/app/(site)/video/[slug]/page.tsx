import Link from 'next/link'
import {notFound} from 'next/navigation'
import {formatDate} from '@/components/date'
import {getVideo, getVideos} from '@/sanity/lib/fetch'

type Props = {
  params: Promise<{slug: string}>
}

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

function youtubeEmbedUrl(url?: string) {
  if (!url) return null

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const id = parsed.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}` : null
      }

      const parts = parsed.pathname.split('/').filter(Boolean)
      if ((parts[0] === 'embed' || parts[0] === 'shorts') && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`
      }
    }
  } catch {
    return null
  }

  return null
}

export async function generateStaticParams() {
  const videos = await getVideos()
  return videos.map((item) => ({slug: item.slug}))
}

export default async function VideoDetailPage({params}: Props) {
  const {slug} = await params
  const item = await getVideo(decodeSlug(slug))

  if (!item) notFound()

  const embedUrl = youtubeEmbedUrl(item.youtubeUrl)
  const hasDirectVideo = Boolean(item.videoUrl)

  return (
    <article className="video-detail">
      <header className="page-hero article-hero">
        <div className="container">
          <div className="article-hero-inner">
            <Link href="/video" className="article-category">
              Video
            </Link>
            <h1>{item.title}</h1>
            <p>{item.dek}</p>
            <div className="article-meta-row">
              <span>{item.duration || 'NNN Video'}</span>
              <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <section className="video-player-shell" aria-label={item.title}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : hasDirectVideo ? (
            <video controls poster={item.image || undefined} preload="metadata">
              <source src={item.videoUrl} />
              Video belum tersedia.
            </video>
          ) : (
            <div className="video-unavailable">
              <p>Video belum tersedia.</p>
            </div>
          )}
        </section>

        <div className="article-shell video-detail-copy">
          <div className="article-body">
            <p>{item.dek}</p>
          </div>
          <aside className="article-aside" aria-label="Video information">
            <div className="editorial-note">
              <strong>NNN Video</strong>
              <p>Video editorial dari Narapati News Network menampilkan wawancara, laporan visual, dan penjelasan isu strategis.</p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
