import Image from 'next/image'
import Link from 'next/link'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {ArticleShareBar} from '@/components/ArticleShareBar'
import {WatermarkedImage} from '@/components/WatermarkedImage'
import {formatDate} from '@/components/date'
import {articles} from '@/data/fallback'
import {articleJsonLd, articlePath, articleUrl, imageUrl, metaDescription, siteName} from '@/lib/seo'
import {getArticle, getArticles, getSiteSettings} from '@/sanity/lib/fetch'
import {urlFor} from '@/sanity/lib/image'

type Props = {
  params: Promise<{slug: string}>
}

export function generateStaticParams() {
  return articles.map((article) => ({slug: article.slug}))
}

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

function articleHref(slug: string) {
  return articlePath(slug)
}

function readingTime(body?: unknown[]) {
  const text = Array.isArray(body)
    ? body.map((block) => {
        if (!block || typeof block !== 'object' || !('children' in block)) return ''
        const children = (block as {children?: Array<{text?: string}>}).children
        return Array.isArray(children) ? children.map((child) => child.text || '').join(' ') : ''
      }).join(' ')
    : ''
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 220))} menit baca`
}

type PortableImageValue = {
  asset?: unknown
  alt?: string
  caption?: string
  credit?: string
  location?: string
  dateTaken?: string
}

function imageCaption(caption?: string, credit?: string, location?: string, dateTaken?: string) {
  if (!caption?.trim()) return null
  const details = [location, dateTaken ? formatDate(dateTaken) : null].filter(Boolean).join(' · ')

  return (
    <figcaption className="article-image-caption">
      <span>{caption}</span>
      {details ? <small>{details}</small> : null}
      {credit?.trim() ? <cite>{credit}</cite> : null}
    </figcaption>
  )
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({value}) => {
      const image = value as PortableImageValue
      if (!image?.asset) return null

      const src = urlFor(image).width(1400).url()

      return (
        <figure className="article-inline-image">
          <span className="article-inline-image-frame">
            <WatermarkedImage
              src={src}
              alt={image.alt || image.caption || ''}
              width={1400}
              height={900}
              sizes="(max-width: 900px) 100vw, 760px"
            />
          </span>
          {imageCaption(image.caption, image.credit, image.location, image.dateTaken)}
        </figure>
      )
    }
  }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const article = await getArticle(decodeSlug(slug))

  if (!article) {
    return {
      title: 'Article Not Found',
      robots: {
        index: false,
        follow: false
      }
    }
  }

  const description = metaDescription(article.dek)
  const canonical = articleUrl(article.slug)
  const ogImage = imageUrl(article.image)

  return {
    title: article.title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title: article.title,
      description,
      url: canonical,
      siteName,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      section: article.category.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [ogImage]
    }
  }
}

export default async function ArticlePage({params}: Props) {
  const {slug} = await params
  const decodedSlug = decodeSlug(slug)
  const [article, allArticles, settings] = await Promise.all([getArticle(decodedSlug), getArticles(), getSiteSettings()])

  if (!article) notFound()

  const relatedArticles = allArticles
    .filter((item) => item.slug !== article.slug && item.category.slug === article.category.slug)
    .slice(0, 3)

  const fallbackRelated = allArticles
    .filter((item) => item.slug !== article.slug && !relatedArticles.some((related) => related.slug === item.slug))
    .slice(0, 3 - relatedArticles.length)

  const related = [...relatedArticles, ...fallbackRelated]
  const body = Array.isArray(article.body) && article.body.length > 0 ? article.body : null
  const authorInitial = article.author.name.charAt(0).toUpperCase()
  const readTime = readingTime(article.body)
  const shareUrl = articleUrl(article.slug)

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{__html: JSON.stringify(articleJsonLd(article))}}
      />
      <article itemScope itemType="https://schema.org/NewsArticle">
        <header className="page-hero article-hero">
          <div className="container">
            <div className="article-hero-inner">
              <Link href={`/category/${encodeURIComponent(article.category.slug)}`} className="article-category" itemProp="articleSection">
                {article.category.title}
              </Link>
              <h1 itemProp="headline">{article.title}</h1>
              <p itemProp="description">{article.dek}</p>
              <div className="article-meta-row">
                <span itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">{article.author.name}</span>
                </span>
                <time dateTime={article.publishedAt} itemProp="datePublished">{formatDate(article.publishedAt)}</time>
                <span>{readTime}</span>
                <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                  <span itemProp="name">Narapati News Network</span>
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="container">
          <figure className="article-cover-frame" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
            <div className="article-cover">
              <WatermarkedImage src={article.image} alt={article.imageAlt || article.title} fill priority sizes="100vw" />
              <meta itemProp="url" content={imageUrl(article.image)} />
            </div>
            {imageCaption(article.imageCaption, article.imageCredit, article.imageLocation, article.imageDateTaken)}
          </figure>
          <div className="article-shell">
            <ArticleShareBar
              title={article.title}
              url={shareUrl}
              placement="desktop"
              instagram={settings.instagram}
              tiktok={settings.tiktok}
              youtube={settings.youtube}
            />
            <div className="article-body" itemProp="articleBody">
              {body ? (
                <PortableText value={body} components={portableTextComponents} />
              ) : (
                <>
                  <p>
                    Narapati News Network reports with an emphasis on context, continuity, and the decisions behind public events. This story is connected to a wider editorial file that follows capital, policy, and institutional change across Indonesia and the region.
                  </p>
                  <p>
                    Our newsroom combines field reporting with document-led analysis, speaking with public officials, private sector leaders, researchers, and communities affected by the policy choices being made today.
                  </p>
                  <p>
                    This article is sample editorial copy and will be replaced automatically when a matching Sanity article is published.
                  </p>
                </>
              )}
            </div>
            <section className="article-author-signature" aria-label="Author">
              <div className="article-author-avatar">
                {article.author.image ? (
                  <Image src={article.author.image} alt="" fill sizes="64px" />
                ) : (
                  <span>{authorInitial}</span>
                )}
              </div>
              <div>
                <span>Written by</span>
                <h2>{article.author.name}</h2>
                <p>{article.author.role || 'Redaksi Narapati'}</p>
              </div>
            </section>
            <ArticleShareBar
              title={article.title}
              url={shareUrl}
              placement="mobile"
              instagram={settings.instagram}
              tiktok={settings.tiktok}
              youtube={settings.youtube}
            />
          </div>
        </div>
      </article>
      {related.length ? (
        <div className="container">
          <section className="related-articles" aria-label="Related articles">
            <div className="section-header">
              <div>
                <div className="eyebrow">Baca Juga</div>
                <h2 className="section-title">Tulisan Lainnya</h2>
              </div>
            </div>
            <div className="related-grid">
              {related.map((item) => (
                <article className="related-card" key={item.slug}>
                  <Link href={articleHref(item.slug)} className="related-image">
                    <WatermarkedImage src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
                  </Link>
                  <div>
                    <div className="eyebrow">{item.category.title}</div>
                    <Link href={articleHref(item.slug)}>
                      <h3>{item.title}</h3>
                    </Link>
                    <p>{formatDate(item.publishedAt)}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
