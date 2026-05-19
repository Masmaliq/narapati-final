import {notFound} from 'next/navigation'
import {ArticleCard} from '@/components/ArticleCard'
import {categories} from '@/data/fallback'
import {getCategory, getCategoryArticles} from '@/sanity/lib/fetch'

type Props = {
  params: Promise<{slug: string}>
}

export function generateStaticParams() {
  return categories.map((category) => ({slug: category.slug}))
}

export default async function CategoryPage({params}: Props) {
  const {slug} = await params
  const [category, articles] = await Promise.all([getCategory(slug), getCategoryArticles(slug)])

  if (!category) notFound()

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Section</div>
          <h1>{category.title}</h1>
          <p>{category.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {articles.length ? (
            <div className="grid-3">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="empty-state">No stories have been published in this section yet.</div>
          )}
        </div>
      </section>
    </>
  )
}
