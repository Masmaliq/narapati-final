'use client'

import Link from 'next/link'
import {useEffect, useMemo, useState} from 'react'
import {WatermarkedImage} from '@/components/WatermarkedImage'

export type JournalHeroSlide = {
  kind: 'article' | 'photography' | 'video'
  title: string
  slug: string
  dek: string
  image: string
  publishedAt: string
  href: string
  label: string
  source: string
  duration?: string
}

type JournalHeroCarouselProps = {
  slides: JournalHeroSlide[]
}

function formatDate(value?: string) {
  if (!value) return 'Narapati'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))
}

function readingTime(slide?: JournalHeroSlide) {
  const seed = slide?.dek?.length || slide?.title?.length || 240
  return `${Math.max(3, Math.min(9, Math.ceil(seed / 180)))} menit baca`
}

export function JournalHeroCarousel({slides}: JournalHeroCarouselProps) {
  const heroSlides = useMemo(() => slides.filter((slide) => slide.slug && slide.href), [slides])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = heroSlides[activeIndex] || heroSlides[0]
  const fallbackImage = heroSlides.find((slide) => slide.image)?.image || ''

  useEffect(() => {
    if (heroSlides.length < 2) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length)
    }, 7000)

    return () => window.clearInterval(timer)
  }, [heroSlides.length])

  if (!activeSlide) return null

  return (
    <section className="journal-hero nnn-container" aria-label="Artikel utama">
      {heroSlides.map((slide, index) => {
        const image = slide.image || fallbackImage
        if (!image) return null

        return (
          <Link
            href={slide.href}
            className="journal-hero-media"
            data-active={index === activeIndex ? 'true' : 'false'}
            data-kind={slide.kind}
            aria-label={slide.title}
            aria-hidden={index === activeIndex ? undefined : true}
            tabIndex={index === activeIndex ? undefined : -1}
            key={slide.slug}
          >
            <WatermarkedImage
              src={image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              watermark={slide.kind === 'photography' ? 'moment' : 'story'}
            />
            {slide.kind === 'video' ? <span className="journal-hero-play" aria-hidden="true">▶</span> : null}
          </Link>
        )
      })}

      <div className="journal-hero-copy" key={activeSlide.slug}>
        <span className="journal-eyebrow">{activeSlide.label}</span>
        <Link href={activeSlide.href}>
          <h1>{activeSlide.title}</h1>
        </Link>
        {activeSlide.dek ? <p>{activeSlide.dek}</p> : null}
        <div className="journal-meta">
          <span>{activeSlide.source}</span>
          <time dateTime={activeSlide.publishedAt}>{formatDate(activeSlide.publishedAt)}</time>
          <span>{activeSlide.duration || readingTime(activeSlide)}</span>
        </div>
        <Link className="journal-button" href={activeSlide.href}>
          {activeSlide.kind === 'video' ? 'Tonton Sekarang' : activeSlide.kind === 'photography' ? 'Lihat Visual' : 'Baca Selengkapnya'}
        </Link>
      </div>

      {heroSlides.length > 1 ? (
        <div className="journal-hero-dots" aria-label="Pilih artikel utama">
          {heroSlides.map((slide, index) => (
            <button
              type="button"
              aria-label={`Tampilkan ${slide.title}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              key={slide.slug}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
