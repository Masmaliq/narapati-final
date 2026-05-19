import Image from 'next/image'
import type {MediaItem} from '@/types/content'
import {formatDate} from '@/components/date'
import {PlayCircle} from 'lucide-react'

export function MediaCard({item}: {item: MediaItem}) {
  return (
    <article className="media-card">
      <div className="thumb wide">
        <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
        <span className="play-badge"><PlayCircle size={22} /></span>
      </div>
      <div className="media-copy">
        <div className="eyebrow">{item.duration}</div>
        <h2>{item.title}</h2>
        <p>{item.dek}</p>
        <div className="meta">{formatDate(item.publishedAt)}</div>
      </div>
    </article>
  )
}
