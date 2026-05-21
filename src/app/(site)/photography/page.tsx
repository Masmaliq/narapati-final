import Image from 'next/image'
import Link from 'next/link'
import {formatDate} from '@/components/date'
import {getPhotography} from '@/sanity/lib/fetch'

function photographyHref(slug: string) {
  return `/photography/${encodeURIComponent(slug)}`
}

export default async function PhotographyPage() {
  const items = await getPhotography()

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Visual Desk</div>
          <h1>NNN Photography</h1>
          <p>Visual essays, documentary frames, and editorial photography from the Narapati newsroom.</p>
        </div>
      </section>
      <section className="section">
        <div className="container photography-grid">
          {items.map((item) => (
            <article className="photography-card" key={item.slug}>
              <Link href={photographyHref(item.slug)} className="photography-card-image">
                <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
              </Link>
              <div>
                <span>{item.duration}</span>
                <Link href={photographyHref(item.slug)}>
                  <h2>{item.title}</h2>
                </Link>
                <p>{item.dek}</p>
                <small>{formatDate(item.publishedAt)}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
