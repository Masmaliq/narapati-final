import Image from 'next/image'
import Link from 'next/link'
import type {MediaItem} from '@/types/content'
import {formatDate} from '@/components/date'
import {PlayCircle} from 'lucide-react'

type MediaCardProps = {
  item: MediaItem
  href?: string
}

export function MediaCard({item, href = `/video/${encodeURIComponent(item.slug)}`}: MediaCardProps) {
  return (
    <article className="media-card">
      <Link href={href} className="thumb wide">
        <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
        <span className="play-badge"><PlayCircle size={22} /></span>
      </Link>
      <div className="media-copy">
        <div className="eyebrow">{item.duration}</div>
        <Link href={href}>
          <h2>{item.title}</h2>
        </Link>
        <p>{item.dek}</p>
        <div className="meta">{formatDate(item.publishedAt)}</div>
      </div>
    </article>
  )
}
