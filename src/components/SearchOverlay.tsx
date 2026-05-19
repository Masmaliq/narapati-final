'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useEffect, useMemo, useRef, useState} from 'react'
import {Search, X} from 'lucide-react'
import {formatDate} from '@/components/date'

export type SearchArticle = {
  title: string
  slug: string
  dek: string
  image: string
  publishedAt: string
  category: {
    title: string
    slug: string
  }
  author: {
    name: string
  }
}

type SearchOverlayProps = {
  articles: SearchArticle[]
}

function articleHref(slug: string) {
  return `/article/${encodeURIComponent(slug)}`
}

export function SearchOverlay({articles}: SearchOverlayProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'

      if (isSearchShortcut) {
        event.preventDefault()
        setOpen(true)
      }

      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!open) return

    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return articles.slice(0, 6)

    return articles
      .filter((article) => {
        const searchable = [
          article.title,
          article.category.title,
          article.author.name
        ].join(' ').toLowerCase()

        return searchable.includes(normalizedQuery)
      })
      .slice(0, 8)
  }, [articles, query])

  return (
    <>
      <button className="search-trigger" type="button" onClick={() => setOpen(true)} aria-label="Open search">
        <Search size={16} />
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>

      {open ? (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search Narapati articles">
          <button className="search-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Close search" />
          <div className="search-panel">
            <div className="search-panel-head">
              <div className="search-input-wrap">
                <Search size={18} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search title, category, or author"
                  aria-label="Search articles"
                />
              </div>
              <button className="search-close" type="button" onClick={() => setOpen(false)} aria-label="Close search">
                <X size={18} />
              </button>
            </div>

            <div className="search-results-meta">
              <span>{query ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Latest articles'}</span>
              <span>Narapati News Network</span>
            </div>

            <div className="search-results">
              {results.length ? (
                results.map((article) => (
                  <Link className="search-result" href={articleHref(article.slug)} key={article.slug} onClick={() => setOpen(false)}>
                    <span className="search-result-image">
                      <Image src={article.image} alt="" fill sizes="72px" />
                    </span>
                    <span className="search-result-copy">
                      <span className="search-result-kicker">{article.category.title} / {article.author.name}</span>
                      <strong>{article.title}</strong>
                      <span>{formatDate(article.publishedAt)}</span>
                    </span>
                  </Link>
                ))
              ) : (
                <div className="search-empty">
                  <strong>No articles found</strong>
                  <span>Try a title, category, or author name.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
