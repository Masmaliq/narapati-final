import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import {WatermarkedImage} from '@/components/WatermarkedImage'
import {formatDate} from '@/components/date'
import {getPhotography, getPhotographyItem} from '@/sanity/lib/fetch'

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

export async function generateStaticParams() {
  const items = await getPhotography()
  return items.map((item) => ({slug: item.slug}))
}

export default async function PhotographyDetailPage({params}: Props) {
  const {slug} = await params
  const item = await getPhotographyItem(decodeSlug(slug))

  if (!item) notFound()

  const body = Array.isArray(item.body) && item.body.length > 0 ? item.body : null
  const gallery = Array.isArray(item.gallery) ? item.gallery.filter(Boolean) : []
  const authorName = item.author?.name || 'Narapati Visual Desk'
  const categoryTitle = item.category?.title || 'Photography'

  return (
    <article className="photography-detail">
      <header className="page-hero article-hero">
        <div className="container">
          <div className="article-hero-inner">
            <Link href="/photography" className="article-category">
              {categoryTitle}
            </Link>
            <h1>{item.title}</h1>
            <p>{item.dek}</p>
            <div className="article-meta-row">
              <span>{authorName}</span>
              <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
              {item.location ? <span>{item.location}</span> : null}
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <figure className="article-cover photography-cover">
          <WatermarkedImage src={item.image} alt="" fill priority sizes="100vw" watermark="moment" />
        </figure>

        <div className="article-shell">
          <div className="article-body">
            {body ? (
              <PortableText value={body} />
            ) : (
              <p>{item.dek}</p>
            )}
          </div>
          <aside className="article-aside" aria-label="Photography information">
            <div className="editorial-note">
              <strong>Visual note</strong>
              <p>
                Photography stories from Narapati Journal document people, places, and details shaping Indonesia&apos;s business,
                leadership, and nilai hidup conversations.
              </p>
            </div>
          </aside>
        </div>

        {gallery.length ? (
          <section className="photography-gallery" aria-label="Photography gallery">
            {gallery.map((image, index) => (
              <div className="photography-gallery-item" key={`${image}-${index}`}>
                <WatermarkedImage src={image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" watermark="moment" />
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </article>
  )
}
