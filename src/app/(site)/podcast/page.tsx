import {MediaCard} from '@/components/MediaCard'
import {getPodcasts} from '@/sanity/lib/fetch'

export default async function PodcastPage() {
  const podcasts = await getPodcasts()

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Audio</div>
          <h1>NNN Podcast</h1>
          <p>Editorial briefings and long-form conversations for listeners who want the larger frame.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          {podcasts.map((item) => (
            <MediaCard key={item.slug} item={item} />
          ))}
        </div>
      </section>
    </>
  )
}
