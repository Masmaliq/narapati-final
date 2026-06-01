'use client'

import {useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {apiVersion} from '@/sanity/env'

type JournalArticle = {
  _id: string
  title?: string
  slug?: string
  category?: string
  author?: string
  status?: string
  updatedAt?: string
  publishedAt?: string
  bodyText?: string
}

const articleQuery = `*[_type == "article" && defined(title)] | order(_updatedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "updatedAt": _updatedAt,
  publishedAt,
  "category": category->title,
  "author": author->name,
  "bodyText": pt::text(body),
  "status": select(
    status == "archived" => "Archived",
    status == "review" => "Review",
    status == "scheduled" => "Scheduled",
    status == "draft" => "Draft",
    status == "published" => "Published",
    _id in path("drafts.**") => "Draft",
    defined(publishedAt) && publishedAt > now() => "Scheduled",
    "Published"
  )
}`

const quickActions = [
  {label: 'New Article', href: '/studio/intent/create/template=article'},
  {label: 'View Drafts', href: '/studio/structure/article-drafts'},
  {label: 'View Published', href: '/studio/structure/article-published'},
  {label: 'Editorial Calendar', href: '/studio/structure/editorial-calendar'},
  {label: 'Scheduled Posts', href: '/studio/structure/article-scheduled'}
]

const articleArchiveActions = [
  {label: 'New Article', href: '/studio/intent/create/template=article'},
  {label: 'View Drafts', href: '/studio/structure/article-drafts'},
  {label: 'View Published', href: '/studio/structure/article-published'}
]

const articleFilters = ['Semua', 'Draft', 'Review', 'Terbit', 'Terjadwal', 'Arsip']

const statusLabels: Record<string, string> = {
  Draft: 'Draft',
  Review: 'Review',
  Published: 'Terbit',
  Scheduled: 'Terjadwal',
  Archived: 'Arsip'
}

const statusFilterMap: Record<string, string> = {
  Semua: 'all',
  Draft: 'Draft',
  Review: 'Review',
  Terbit: 'Published',
  Terjadwal: 'Scheduled',
  Arsip: 'Archived'
}

function formatDate(value?: string) {
  if (!value) return 'Belum diperbarui'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}

function readingTime(value?: string) {
  const words = value?.trim().split(/\s+/).filter(Boolean).length || 0
  return `${Math.max(1, Math.ceil(words / 180))} min`
}

function statusStyle(status?: string) {
  const key = status || 'Published'
  const variants: Record<string, object> = {
    Draft: {borderColor: 'rgba(110, 118, 129, 0.24)', background: 'rgba(110, 118, 129, 0.08)', color: '#5e6673'},
    Review: {borderColor: 'rgba(179, 138, 86, 0.34)', background: 'rgba(179, 138, 86, 0.12)', color: '#9a6f2f'},
    Published: {borderColor: 'rgba(11, 27, 59, 0.18)', background: 'rgba(11, 27, 59, 0.08)', color: '#0b1b3b'},
    Scheduled: {borderColor: 'rgba(78, 105, 145, 0.24)', background: 'rgba(78, 105, 145, 0.08)', color: '#4e6991'},
    Archived: {borderColor: 'rgba(15, 23, 42, 0.16)', background: 'rgba(15, 23, 42, 0.05)', color: 'rgba(15, 23, 42, 0.54)'}
  }

  return {...styles.statusBadge, ...(variants[key] || variants.Published)}
}

function duplicateUrl(item: JournalArticle) {
  const title = item.title ? `${item.title} Copy` : 'Untitled Copy'
  const params = new URLSearchParams({
    template: 'article',
    title
  })

  return `/studio/intent/create?${params.toString()}`
}

export function JournalDesk() {
  return (
    <main style={styles.shell}>
      <section style={styles.hero}>
        <span style={styles.eyebrow}>Narapati Journal</span>
        <h1 style={styles.title}>Journal Desk</h1>
        <p style={styles.description}>Kelola tulisan, draft, jadwal publikasi, dan arsip editorial Narapati.</p>
      </section>

      <section style={styles.quickPanel} aria-label="Journal quick actions">
        {quickActions.map((action) => (
          <a href={action.href} style={styles.quickAction} key={action.label}>
            {action.label}
          </a>
        ))}
      </section>

      <section style={styles.notePanel}>
        <span style={styles.noteLabel}>Workflow</span>
        <p style={styles.noteText}>
          Mulai dari draft, rapikan sudut pandang, jadwalkan terbit, lalu simpan arsip tulisan sebagai jejak editorial Narapati.
        </p>
      </section>
    </main>
  )
}

export function JournalArticleList() {
  const client = useClient({apiVersion})
  const [items, setItems] = useState<JournalArticle[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    client
      .fetch<JournalArticle[]>(articleQuery)
      .then((result) => {
        if (mounted) setItems(result || [])
      })
      .catch((error) => {
        console.error('Failed to load Journal articles', error)
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
    const selectedStatus = statusFilterMap[filter]

    return items.filter((item) => {
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
      const haystack = [item.title, item.category, item.author].join(' ').toLowerCase()
      return matchesStatus && (!needle || haystack.includes(needle))
    })
  }, [filter, items, query])

  const articleCount = filteredItems.length

  return (
    <main style={styles.shell}>
      <section style={styles.heroCompact}>
        <span style={styles.eyebrow}>Journal Desk</span>
        <h1 style={styles.titleSmall}>Semua Tulisan</h1>
        <p style={styles.description}>Kelola seluruh artikel Narapati, mulai dari draft, review, terjadwal, hingga terbit.</p>
      </section>

      <section style={styles.archiveActions} aria-label="Top article actions">
        {articleArchiveActions.map((action) => (
          <a href={action.href} style={action.label === 'New Article' ? styles.primaryButton : styles.secondaryButton} key={action.label}>
            {action.label}
          </a>
        ))}
      </section>

      <section style={styles.archiveToolbar} aria-label="Article archive controls">
        <label style={styles.archiveSearchLabel}>
          <span>Cari</span>
          <input
            style={styles.archiveSearchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul, kategori, atau penulis..."
          />
        </label>
      </section>

      <div style={styles.filterBar} aria-label="Filter tulisan">
        {articleFilters.map((item) => (
          <button
            type="button"
            style={filter === item ? {...styles.filterButton, ...styles.filterButtonActive} : styles.filterButton}
            onClick={() => setFilter(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? <p style={styles.loadingText}>Memuat tulisan...</p> : null}

      {filteredItems.length ? (
        <section style={styles.articleList} aria-label="Semua tulisan Narapati">
          {filteredItems.map((item) => (
            <article style={styles.articleRow} key={item._id}>
              <div style={styles.articleMain}>
                <span style={styles.articleCategory}>{item.category || 'Journal'}</span>
                <h2 style={styles.articleTitle}>{item.title || 'Untitled'}</h2>
                <div style={styles.articleMeta}>
                  <span>{item.author || 'Narapati'}</span>
                  <span>Updated {formatDate(item.updatedAt)}</span>
                  <span>{readingTime(item.bodyText)}</span>
                </div>
              </div>
              <span style={statusStyle(item.status)}>{statusLabels[item.status || 'Published'] || 'Terbit'}</span>
              <div style={styles.rowActions}>
                <a href={`/studio/structure/article;${item._id}`} style={styles.rowAction}>Edit</a>
                {item.slug ? <a href={`/article/${encodeURIComponent(item.slug)}`} target="_blank" rel="noreferrer" style={styles.rowAction}>Preview</a> : null}
                <a href={duplicateUrl(item)} style={styles.rowAction}>Duplicate</a>
                <a href={`/studio/structure/article;${item._id}`} style={styles.rowActionMuted}>Archive</a>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>Belum ada tulisan.</h2>
          <p style={styles.emptyText}>Mulai tulis artikel pertama Narapati.</p>
          <a href="/studio/intent/create/template=article" style={styles.emptyButton}>New Article</a>
        </section>
      )}
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
    maxWidth: 860,
    borderBottom: '1px solid rgba(179, 138, 86, 0.28)',
    marginBottom: 22,
    paddingBottom: 24
  },
  heroCompact: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
    borderBottom: '1px solid rgba(179, 138, 86, 0.22)',
    marginBottom: 18,
    paddingBottom: 18
  },
  eyebrow: {
    color: '#b38a56',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const
  },
  title: {
    margin: '12px 0 10px',
    color: '#0f172a',
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(42px, 5vw, 76px)',
    fontWeight: 500,
    letterSpacing: '-0.03em',
    lineHeight: 0.95
  },
  titleSmall: {
    margin: 0,
    color: '#0f172a',
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(34px, 4vw, 58px)',
    fontWeight: 500,
    letterSpacing: '-0.025em',
    lineHeight: 1
  },
  description: {
    maxWidth: 680,
    margin: 0,
    color: 'rgba(15, 23, 42, 0.64)',
    fontSize: 16,
    lineHeight: 1.65
  },
  quickPanel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: 12,
    marginBottom: 18
  },
  quickAction: {
    display: 'inline-flex',
    justifyContent: 'center',
    border: '1px solid #0b1b3b',
    borderRadius: 999,
    background: '#0b1b3b',
    color: '#fbf8f2',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    padding: '12px 14px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const
  },
  notePanel: {
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 14,
    background: 'rgba(255, 253, 248, 0.64)',
    padding: 22
  },
  noteLabel: {
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const
  },
  noteText: {
    maxWidth: 680,
    margin: '8px 0 0',
    color: '#0f172a',
    fontFamily: 'var(--font-serif)',
    fontSize: 22,
    lineHeight: 1.25
  },
  loadingText: {
    color: 'rgba(15, 23, 42, 0.52)',
    fontSize: 13,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const
  },
  archiveToolbar: {
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 1fr)',
    gap: 14,
    alignItems: 'stretch',
    marginBottom: 14
  },
  archiveActions: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 10,
    marginBottom: 14
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #0b1b3b',
    borderRadius: 999,
    background: '#0b1b3b',
    color: '#fbf8f2',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    minHeight: 44,
    padding: '0 16px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(179, 138, 86, 0.34)',
    borderRadius: 999,
    background: 'rgba(255, 253, 248, 0.66)',
    color: '#0b1b3b',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    minHeight: 44,
    padding: '0 16px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const
  },
  archiveSearchLabel: {
    display: 'grid',
    gap: 7,
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const
  },
  archiveSearchInput: {
    boxSizing: 'border-box' as const,
    width: '100%',
    minHeight: 44,
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 999,
    background: 'rgba(255, 253, 248, 0.76)',
    color: '#0f172a',
    fontSize: 14,
    outline: 'none',
    padding: '0 16px'
  },
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 8,
    marginBottom: 18
  },
  filterButton: {
    border: '1px solid rgba(221, 211, 195, 0.96)',
    borderRadius: 999,
    background: 'rgba(255, 253, 248, 0.64)',
    color: 'rgba(15, 23, 42, 0.58)',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.09em',
    padding: '8px 12px',
    textTransform: 'uppercase' as const
  },
  filterButtonActive: {
    borderColor: 'rgba(179, 138, 86, 0.46)',
    background: 'rgba(179, 138, 86, 0.12)',
    color: '#9a6f2f'
  },
  articleList: {
    display: 'grid',
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 14,
    background: 'rgba(255, 253, 248, 0.66)',
    overflow: 'hidden'
  },
  articleRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto minmax(220px, auto)',
    gap: 16,
    alignItems: 'center',
    borderBottom: '1px solid rgba(221, 211, 195, 0.68)',
    padding: '18px 20px'
  },
  articleMain: {
    display: 'grid',
    gap: 7
  },
  articleCategory: {
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const
  },
  articleTitle: {
    margin: 0,
    color: '#0f172a',
    fontFamily: 'var(--font-serif)',
    fontSize: 24,
    fontWeight: 500,
    lineHeight: 1.08
  },
  articleMeta: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px 14px',
    color: 'rgba(15, 23, 42, 0.52)',
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
  rowAction: {
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.1em',
    textDecoration: 'none',
    textTransform: 'uppercase' as const
  },
  rowActions: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'flex-end',
    gap: '8px 12px'
  },
  rowActionMuted: {
    color: 'rgba(15, 23, 42, 0.42)',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.1em',
    textDecoration: 'none',
    textTransform: 'uppercase' as const
  },
  emptyState: {
    display: 'grid',
    justifyItems: 'start',
    gap: 14,
    border: '1px dashed rgba(179, 138, 86, 0.34)',
    borderRadius: 14,
    background: 'rgba(255, 253, 248, 0.54)',
    padding: 28
  },
  emptyTitle: {
    margin: 0,
    color: '#0f172a',
    fontFamily: 'var(--font-serif)',
    fontSize: 30,
    fontWeight: 500,
    lineHeight: 1.05
  },
  emptyText: {
    margin: 0,
    color: 'rgba(15, 23, 42, 0.58)',
    fontSize: 14,
    lineHeight: 1.6
  },
  emptyButton: {
    display: 'inline-flex',
    borderRadius: 999,
    background: '#0b1b3b',
    color: '#fbf8f2',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    padding: '12px 16px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const
  }
}
