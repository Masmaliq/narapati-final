'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useEffect, useMemo, useState} from 'react'
import type {Article} from '@/types/content'

type JournalHeroCarouselProps = {
  slides: Article[]
}

function articleHref(slug: string) {
  return `/article/${encodeURIComponent(slug)}`
}

function formatDate(value?: string) {
  if (!value) return 'Narapati'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))
}

function readingTime(article?: Article) {
  const seed = article?.body?.length || article?.dek?.length || article?.title?.length || 240
  return `${Math.max(3, Math.min(9, Math.ceil(seed / 180)))} menit baca`
}

function categoryOf(article?: Article) {
  return article?.category?.title || 'Journal'
}

function authorOf(article?: Article) {
  return article?.author?.name || 'Narapati'
}

export function JournalHeroCarousel({slides}: JournalHeroCarouselProps) {
  const heroSlides = useMemo(() => slides.filter((slide) => slide.slug), [slides])
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
            href={articleHref(slide.slug)}
            className="journal-hero-media"
            data-active={index === activeIndex ? 'true' : 'false'}
            aria-label={slide.title}
            aria-hidden={index === activeIndex ? undefined : true}
            tabIndex={index === activeIndex ? undefined : -1}
            key={slide.slug}
          >
            <Image src={image} alt="" fill priority={index === 0} sizes="100vw" />
          </Link>
        )
      })}

      <div className="journal-hero-copy" key={activeSlide.slug}>
        <span className="journal-eyebrow">{categoryOf(activeSlide)}</span>
        <Link href={articleHref(activeSlide.slug)}>
          <h1>{activeSlide.title}</h1>
        </Link>
        {activeSlide.dek ? <p>{activeSlide.dek}</p> : null}
        <div className="journal-meta">
          <span>{authorOf(activeSlide)}</span>
          <time dateTime={activeSlide.publishedAt}>{formatDate(activeSlide.publishedAt)}</time>
          <span>{readingTime(activeSlide)}</span>
        </div>
        <Link className="journal-button" href={articleHref(activeSlide.slug)}>
          Baca Selengkapnya
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
