'use client'

import {useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {apiVersion} from '@/sanity/env'

type PhotoItem = {
  _id: string
  title?: string
  caption?: string
  credit?: string
  location?: string
  dateTaken?: string
  publishedAt?: string
  visualCategory?: string
  image?: string
}

const visualFilters = ['All', 'Travel', 'Human', 'Culture', 'Spiritual', 'Landscape', 'Journal']

const photographyQuery = `*[_type == "photography" && !(_id in path("drafts.**"))] | order(coalesce(dateTaken, publishedAt) desc) {
  _id,
  title,
  caption,
  credit,
  location,
  dateTaken,
  publishedAt,
  visualCategory,
  "image": mainImage.asset->url
}`

function formatDate(value?: string) {
  if (!value) return 'No date'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}

export function PhotographyLibrary() {
  const client = useClient({apiVersion})
  const [items, setItems] = useState<PhotoItem[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    client
      .fetch<PhotoItem[]>(photographyQuery)
      .then((result) => {
        if (mounted) setItems(result || [])
      })
      .catch((error) => {
        console.error('Failed to load Photography Library', error)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [client])

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return items.filter((item) => {
      const matchesFilter = filter === 'All' || item.visualCategory === filter
      const haystack = [
        item.title,
        item.caption,
        item.credit,
        item.location,
        item.visualCategory
      ].join(' ').toLowerCase()

      return matchesFilter && (!needle || haystack.includes(needle))
    })
  }, [filter, items, query])

  return (
    <main style={styles.shell}>
      <section style={styles.hero}>
        <span style={styles.eyebrow}>Visual Journal Archive</span>
        <h1 style={styles.title}>Photography Library</h1>
        <p style={styles.description}>
          Arsip visual Narapati untuk membaca manusia, ruang, perjalanan, kebudayaan, dan momen yang membentuk cerita.
        </p>
      </section>

      <section style={styles.toolbar} aria-label="Photography controls">
        <div style={styles.countBox}>
          <span style={styles.countLabel}>Image Count</span>
          <strong style={styles.countValue}>{filteredItems.length}</strong>
          <small style={styles.countMeta}>of {items.length} photos</small>
        </div>

        <label style={styles.searchLabel}>
          <span>Search photos</span>
          <input
            style={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, location, caption, credit..."
          />
        </label>
      </section>

      <div style={styles.filterRow} aria-label="Photography filters">
        {visualFilters.map((item) => (
          <button
            type="button"
            style={item === filter ? {...styles.filterButton, ...styles.filterButtonActive} : styles.filterButton}
            onClick={() => setFilter(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? <p style={styles.loadingText}>Loading visual archive...</p> : null}

      <section style={styles.grid} aria-label="Photography grid">
        {filteredItems.length ? (
          filteredItems.map((item) => (
            <article style={styles.card} key={item._id}>
              <a style={styles.imageLink} href={`/studio/structure/photography;${item._id}`}>
                {item.image ? (
                  <img src={item.image} alt={item.title || ''} style={styles.image} />
                ) : (
                  <span style={styles.imageEmpty}>No Image</span>
                )}
              </a>
              <div style={styles.cardCopy}>
                <span style={styles.category}>{item.visualCategory || 'Journal'}</span>
                <h2 style={styles.cardTitle}>{item.title || 'Untitled'}</h2>
                {item.caption ? <p style={styles.caption}>{item.caption}</p> : null}
                <dl style={styles.metaList}>
                  <div>
                    <dt>Credit</dt>
                    <dd>{item.credit || 'Narapati Visual Desk'}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{item.location || 'Indonesia'}</dd>
                  </div>
                  <div>
                    <dt>Date Taken</dt>
                    <dd>{formatDate(item.dateTaken || item.publishedAt)}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))
        ) : (
          <div style={styles.emptyState}>No photos match this library view.</div>
        )}
      </section>
    </main>
  )
}

const styles = {
  shell: {
    minHeight: '100%',
    background: 'linear-gradient(180deg, #fbf8f2 0%, #f6f1e8 100%)',
    color: '#0f172a',
    padding: 'clamp(28px, 5vw, 56px)'
  },
  hero: {
    maxWidth: 880,
    borderBottom: '1px solid rgba(179, 138, 86, 0.28)',
    marginBottom: 24,
    paddingBottom: 24
  },
  eyebrow: {
    color: '#b38a56',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const
  },
  title: {
    margin: '12px 0 10px',
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    fontSize: 'clamp(36px, 5vw, 74px)',
    fontWeight: 500,
    letterSpacing: '-0.035em',
    lineHeight: 0.95
  },
  description: {
    maxWidth: 680,
    margin: 0,
    color: 'rgba(15, 23, 42, 0.64)',
    fontSize: 16,
    lineHeight: 1.65
  },
  toolbar: {
    display: 'grid',
    gridTemplateColumns: 'minmax(160px, 220px) minmax(240px, 1fr)',
    gap: 16,
    alignItems: 'stretch',
    marginBottom: 18
  },
  countBox: {
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 12,
    background: 'rgba(255, 253, 248, 0.68)',
    padding: 18
  },
  countLabel: {
    display: 'block',
    color: 'rgba(15, 23, 42, 0.54)',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const
  },
  countValue: {
    display: 'block',
    marginTop: 10,
    color: '#b38a56',
    fontFamily: 'Georgia, serif',
    fontSize: 46,
    fontWeight: 500,
    lineHeight: 0.9
  },
  countMeta: {
    color: 'rgba(15, 23, 42, 0.48)'
  },
  searchLabel: {
    display: 'grid',
    gap: 10,
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 12,
    background: 'rgba(255, 253, 248, 0.68)',
    color: 'rgba(15, 23, 42, 0.54)',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.16em',
    padding: 18,
    textTransform: 'uppercase' as const
  },
  searchInput: {
    width: '100%',
    border: '0',
    borderBottom: '1px solid rgba(179, 138, 86, 0.32)',
    background: 'transparent',
    color: '#0f172a',
    fontSize: 18,
    outline: 'none',
    padding: '8px 0'
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 10,
    marginBottom: 24
  },
  filterButton: {
    border: '1px solid rgba(179, 138, 86, 0.28)',
    borderRadius: 999,
    background: 'rgba(255, 253, 248, 0.52)',
    color: 'rgba(15, 23, 42, 0.64)',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.12em',
    padding: '9px 13px',
    textTransform: 'uppercase' as const
  },
  filterButtonActive: {
    background: '#0f172a',
    borderColor: '#0f172a',
    color: '#f5f2ea'
  },
  loadingText: {
    color: 'rgba(15, 23, 42, 0.52)',
    fontSize: 13,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 18
  },
  card: {
    overflow: 'hidden',
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 14,
    background: 'rgba(255, 253, 248, 0.7)',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.052)'
  },
  imageLink: {
    position: 'relative' as const,
    display: 'block',
    aspectRatio: '4 / 3',
    overflow: 'hidden',
    background: '#ded4c5'
  },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  },
  imageEmpty: {
    display: 'grid',
    height: '100%',
    placeItems: 'center',
    color: 'rgba(15, 23, 42, 0.46)',
    fontSize: 12,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const
  },
  cardCopy: {
    display: 'grid',
    gap: 10,
    padding: 18
  },
  category: {
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const
  },
  cardTitle: {
    margin: 0,
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    fontSize: 25,
    fontWeight: 500,
    letterSpacing: '-0.01em',
    lineHeight: 1
  },
  caption: {
    margin: 0,
    color: 'rgba(15, 23, 42, 0.62)',
    fontSize: 14,
    lineHeight: 1.55
  },
  metaList: {
    display: 'grid',
    gap: 8,
    borderTop: '1px solid rgba(179, 138, 86, 0.18)',
    margin: '4px 0 0',
    paddingTop: 12
  },
  emptyState: {
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 12,
    color: 'rgba(15, 23, 42, 0.58)',
    padding: 24
  }
}
