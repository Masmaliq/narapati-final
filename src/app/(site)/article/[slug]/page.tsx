import Image from 'next/image'
import Link from 'next/link'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import {formatDate} from '@/components/date'
import {articles} from '@/data/fallback'
import {articleJsonLd, articlePath, articleUrl, imageUrl, metaDescription, siteName} from '@/lib/seo'
import {getArticle, getArticles} from '@/sanity/lib/fetch'

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
  const [article, allArticles] = await Promise.all([getArticle(decodedSlug), getArticles()])

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
                <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                  <span itemProp="name">Narapati News Network</span>
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="container">
          <figure className="article-cover" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
            <Image src={article.image} alt="" fill priority sizes="100vw" />
            <meta itemProp="url" content={imageUrl(article.image)} />
          </figure>
          <div className="article-shell">
            <div className="article-body" itemProp="articleBody">
              {body ? (
                <PortableText value={body} />
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
            <aside className="article-aside" aria-label="Article information">
              <div className="author-card">
                <div className="author-avatar">
                  {article.author.image ? (
                    <Image src={article.author.image} alt="" fill sizes="56px" />
                  ) : (
                    <span>{authorInitial}</span>
                  )}
                </div>
                <div>
                  <span className="eyebrow">Penulis</span>
                  <h2>{article.author.name}</h2>
                  <p>{article.author.role || 'Editorial'}</p>
                </div>
              </div>
              <div className="editorial-note">
                <strong>Editorial note</strong>
                <p>NNN separates reporting, analysis, and opinion. Article updates are reviewed by section editors before publication.</p>
              </div>
            </aside>
          </div>
        </div>
      </article>
      {related.length ? (
        <div className="container">
          <section className="related-articles" aria-label="Related articles">
            <div className="section-header">
              <div>
                <div className="eyebrow">Baca Juga</div>
                <h2 className="section-title">Related Articles</h2>
              </div>
            </div>
            <div className="related-grid">
              {related.map((item) => (
                <article className="related-card" key={item.slug}>
                  <Link href={articleHref(item.slug)} className="related-image">
                    <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
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
