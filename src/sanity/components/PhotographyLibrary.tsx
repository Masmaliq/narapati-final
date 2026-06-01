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
  category?: string
  image?: string
  status?: string
}

const visualFilters = ['All', 'Travel', 'Human', 'Culture', 'Spiritual', 'Landscape', 'Journal']

const photographyQuery = `*[_type == "photography"] | order(coalesce(dateTaken, publishedAt, _updatedAt) desc) {
  _id,
  title,
  caption,
  credit,
  location,
  dateTaken,
  publishedAt,
  visualCategory,
  "category": coalesce(category->title, visualCategory, "Photography"),
  "image": mainImage.asset->url,
  "status": select(
    status == "archived" => "Archived",
    status == "review" => "Review",
    status == "published" => "Published",
    status == "draft" => "Draft",
    _id in path("drafts.**") => "Draft",
    "Published"
  )
}`

function formatDate(value?: string) {
  if (!value) return 'No date'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}

function statusStyle(status?: string) {
  const key = status || 'Published'
  const variants: Record<string, object> = {
    Draft: {borderColor: 'rgba(110, 118, 129, 0.24)', background: 'rgba(110, 118, 129, 0.08)', color: '#5e6673'},
    Review: {borderColor: 'rgba(179, 138, 86, 0.34)', background: 'rgba(179, 138, 86, 0.12)', color: '#9a6f2f'},
    Published: {borderColor: 'rgba(11, 27, 59, 0.18)', background: 'rgba(11, 27, 59, 0.08)', color: '#0b1b3b'},
    Archived: {borderColor: 'rgba(15, 23, 42, 0.16)', background: 'rgba(15, 23, 42, 0.05)', color: 'rgba(15, 23, 42, 0.54)'}
  }

  return {...styles.statusBadge, ...(variants[key] || variants.Published)}
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
        <h1 style={styles.title}>Photography Desk</h1>
        <p style={styles.description}>
          Kelola arsip visual, caption editorial, lokasi, kredit foto, dan cerita di balik gambar Narapati.
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

      <section style={styles.list} aria-label="Photography list view">
        {filteredItems.length ? (
          filteredItems.map((item) => (
            <article style={styles.row} key={item._id}>
              <a style={styles.thumbnailLink} href={`/studio/structure/photography;${item._id}`}>
                {item.image ? (
                  <img src={item.image} alt={item.title || ''} style={styles.thumbnail} />
                ) : (
                  <span style={styles.imageEmpty}>No Image</span>
                )}
              </a>
              <div style={styles.rowCopy}>
                <span style={styles.category}>{item.visualCategory || 'Journal'}</span>
                <h2 style={styles.rowTitle}>{item.title || 'Untitled'}</h2>
                {item.caption ? <p style={styles.caption}>{item.caption}</p> : null}
              </div>
              <div style={styles.rowMeta}>
                <span>{item.location || 'Indonesia'}</span>
                <span>{formatDate(item.dateTaken || item.publishedAt)}</span>
                <span>{item.credit || 'Narapati Visual Desk'}</span>
                <span>{item.category || 'Photography'}</span>
              </div>
              <span style={statusStyle(item.status)}>{item.status || 'Published'}</span>
              <a style={styles.actionLink} href={`/studio/structure/photography;${item._id}`}>Edit</a>
            </article>
          ))
        ) : (
          <div style={styles.emptyState}>Belum ada foto yang cocok dengan tampilan arsip ini.</div>
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
    fontFamily: 'var(--font-sans)',
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
    fontFamily: 'var(--font-serif)',
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
    fontFamily: 'var(--font-serif)',
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
  list: {
    display: 'grid',
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 14,
    background: 'rgba(255, 253, 248, 0.68)',
    overflow: 'hidden'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '112px minmax(220px, 1fr) minmax(210px, 0.72fr) auto auto',
    gap: 18,
    alignItems: 'center',
    borderBottom: '1px solid rgba(221, 211, 195, 0.68)',
    padding: 18
  },
  thumbnailLink: {
    position: 'relative' as const,
    display: 'block',
    width: 112,
    aspectRatio: '4 / 3',
    borderRadius: 10,
    overflow: 'hidden',
    background: '#ded4c5'
  },
  thumbnail: {
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
  rowCopy: {
    display: 'grid',
    gap: 8
  },
  category: {
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const
  },
  rowTitle: {
    margin: 0,
    color: '#0f172a',
    fontFamily: 'var(--font-serif)',
    fontSize: 23,
    fontWeight: 500,
    letterSpacing: '-0.01em',
    lineHeight: 1.05
  },
  caption: {
    margin: 0,
    color: 'rgba(15, 23, 42, 0.62)',
    fontSize: 14,
    lineHeight: 1.55
  },
  rowMeta: {
    display: 'grid',
    gap: 7,
    color: 'rgba(15, 23, 42, 0.56)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const
  },
  statusBadge: {
    border: '1px solid rgba(179, 138, 86, 0.24)',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.08em',
    padding: '7px 10px',
    textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const
  },
  actionLink: {
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.1em',
    textDecoration: 'none',
    textTransform: 'uppercase' as const
  },
  emptyState: {
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 12,
    color: 'rgba(15, 23, 42, 0.58)',
    padding: 24
  }
}
