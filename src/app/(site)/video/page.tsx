import {MediaCard} from '@/components/MediaCard'
import {getVideos} from '@/sanity/lib/fetch'

export default async function VideoPage() {
  const videos = await getVideos()

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Video</div>
          <h1>Narapati Journal Video</h1>
          <p>Field dispatches, studio interviews, and visual explainers from the Narapati editorial desk.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          {videos.map((item) => (
            <MediaCard key={item.slug} item={item} />
          ))}
        </div>
      </section>
    </>
  )
}
