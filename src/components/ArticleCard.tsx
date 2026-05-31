import Link from 'next/link'
import type {Article} from '@/types/content'
import {formatDate} from '@/components/date'
import {WatermarkedImage} from '@/components/WatermarkedImage'

type ArticleCardProps = {
  article: Article
  wide?: boolean
  variant?: 'standard' | 'feature' | 'compact'
}

export function ArticleCard({article, wide = false, variant = 'standard'}: ArticleCardProps) {
  return (
    <article className={`card card-${variant}`}>
      <Link href={`/article/${article.slug}`} className={`thumb ${wide ? 'wide' : ''}`}>
        <WatermarkedImage src={article.image} alt="" fill sizes={wide ? '(max-width: 900px) 100vw, 50vw' : '(max-width: 900px) 100vw, 33vw'} />
      </Link>
      <div className="card-copy">
        <div className="eyebrow">{article.category.title}</div>
        <Link href={`/article/${article.slug}`}>
          <h2>{article.title}</h2>
        </Link>
        <p>{article.dek}</p>
        <div className="meta">{formatDate(article.publishedAt)} / {article.author.name}</div>
      </div>
    </article>
  )
}
