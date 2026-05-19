import Image from 'next/image'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import {formatDate} from '@/components/date'
import {articles} from '@/data/fallback'
import {getArticle} from '@/sanity/lib/fetch'

type Props = {
  params: Promise<{slug: string}>
}

export function generateStaticParams() {
  return articles.map((article) => ({slug: article.slug}))
}

export default async function ArticlePage({params}: Props) {
  const {slug} = await params
  const article = await getArticle(slug)

  if (!article) notFound()

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">{article.category.title}</div>
          <h1>{article.title}</h1>
          <p>{article.dek}</p>
          <div className="meta hero-meta" style={{marginTop: 24}}>
            {formatDate(article.publishedAt)} / {article.author.name}
          </div>
        </div>
      </section>
      <div className="container">
        <div className="thumb wide" style={{marginTop: 28}}>
          <Image src={article.image} alt="" fill priority sizes="100vw" />
        </div>
        <div className="article-shell">
          <article className="article-body">
            {article.body ? (
              <PortableText value={article.body} />
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
          </article>
          <aside className="article-aside">
            <strong>Editorial note</strong>
            <p>NNN separates reporting, analysis, and opinion. Article updates are reviewed by section editors before publication.</p>
          </aside>
        </div>
      </div>
    </>
  )
}
