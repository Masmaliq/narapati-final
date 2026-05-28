'use client'

import {useEffect} from 'react'

const revealSelectors = [
  '.journal-section',
  '.journal-visual',
  '.journal-video-journal',
  '.related-articles',
  '.photography-grid'
]

const cardSelectors = [
  '.journal-card',
  '.journal-category-card',
  '.journal-feature-row',
  '.journal-note',
  '.journal-photo-card',
  '.journal-video-main',
  '.journal-video-copy',
  '.journal-video-list a',
  '.related-card',
  '.photography-card'
]

export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors.join(',')))
    const cardItems = Array.from(document.querySelectorAll<HTMLElement>(cardSelectors.join(',')))

    revealItems.forEach((item) => {
      item.dataset.reveal = 'ready'
    })

    cardItems.forEach((item, index) => {
      item.dataset.revealCard = 'ready'
      item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 90}ms`)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12
      }
    )

    revealItems.forEach((item) => observer.observe(item))
    cardItems.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return null
}
