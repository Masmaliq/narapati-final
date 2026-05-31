'use client'

import {useEffect, useState} from 'react'
import {useClient} from 'sanity'
import {apiVersion} from '@/sanity/env'

type RecentItem = {
  title?: string
  publishedAt?: string
  category?: string
}

type DashboardData = {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  photographyPosts: number
  videoPosts: number
  recentArticles: RecentItem[]
  recentPhotography: RecentItem[]
  recentVideos: RecentItem[]
}

const dashboardQuery = `{
  "totalArticles": count(*[_type == "article"]),
  "publishedArticles": count(*[_type == "article" && !(_id in path("drafts.**"))]),
  "draftArticles": count(*[_type == "article" && _id in path("drafts.**")]),
  "photographyPosts": count(*[_type == "photography" && !(_id in path("drafts.**"))]),
  "videoPosts": count(*[_type == "video" && !(_id in path("drafts.**"))]),
  "recentArticles": *[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...5] {
    title,
    publishedAt,
    "category": category->title
  },
  "recentPhotography": *[_type == "photography" && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...4] {
    title,
    publishedAt,
    "category": coalesce(location, "Photography")
  },
  "recentVideos": *[_type == "video" && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...4] {
    title,
    publishedAt,
    "category": "Video Journal"
  }
}`

const fallbackData: DashboardData = {
  totalArticles: 0,
  publishedArticles: 0,
  draftArticles: 0,
  photographyPosts: 0,
  videoPosts: 0,
  recentArticles: [],
  recentPhotography: [],
  recentVideos: []
}

function formatDate(value?: string) {
  if (!value) return 'Belum dijadwalkan'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}

function StatCard({label, value}: {label: string; value: number}) {
  return (
    <article style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <strong style={styles.statValue}>{value}</strong>
    </article>
  )
}

function RecentList({title, items}: {title: string; items: RecentItem[]}) {
  return (
    <section style={styles.recentPanel}>
      <div style={styles.panelHead}>
        <span style={styles.panelKicker}>Recent</span>
        <h2 style={styles.panelTitle}>{title}</h2>
      </div>
      <div style={styles.recentList}>
        {items.length ? (
          items.map((item, index) => (
            <article style={styles.recentItem} key={`${title}-${item.title}-${index}`}>
              <span style={styles.recentIndex}>{String(index + 1).padStart(2, '0')}</span>
              <div style={styles.recentCopy}>
                <strong style={styles.recentTitle}>{item.title || 'Untitled'}</strong>
                <span style={styles.recentMeta}>{item.category || title} · {formatDate(item.publishedAt)}</span>
              </div>
            </article>
          ))
        ) : (
          <p style={styles.emptyText}>Belum ada konten terbaru.</p>
        )}
      </div>
    </section>
  )
}

export function NewsroomDashboard() {
  const client = useClient({apiVersion})
  const [data, setData] = useState<DashboardData>(fallbackData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    client
      .fetch<DashboardData>(dashboardQuery)
      .then((result) => {
        if (mounted) setData({...fallbackData, ...result})
      })
      .catch((error) => {
        console.error('Failed to load Narapati Studio dashboard', error)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [client])

  return (
    <main style={styles.shell}>
      <section style={styles.hero}>
        <span style={styles.eyebrow}>Narapati Studio</span>
        <h1 style={styles.title}>Newsroom Dashboard</h1>
        <p style={styles.description}>
          Ruang kerja editorial untuk membaca ritme publikasi, visual journal, dan agenda narasi Narapati.
        </p>
      </section>

      <section style={styles.statsGrid} aria-label="Newsroom overview">
        <StatCard label="Total Articles" value={data.totalArticles} />
        <StatCard label="Published Articles" value={data.publishedArticles} />
        <StatCard label="Draft Articles" value={data.draftArticles} />
        <StatCard label="Photography Posts" value={data.photographyPosts} />
        <StatCard label="Video Journal Posts" value={data.videoPosts} />
      </section>

      {loading ? <p style={styles.loadingText}>Loading editorial overview...</p> : null}

      <section style={styles.recentGrid}>
        <RecentList title="Articles" items={data.recentArticles} />
        <RecentList title="Photography" items={data.recentPhotography} />
        <RecentList title="Video Journal" items={data.recentVideos} />
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
    maxWidth: 820,
    borderBottom: '1px solid rgba(179, 138, 86, 0.28)',
    marginBottom: 28,
    paddingBottom: 24
  },
  eyebrow: {
    color: '#b38a56',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const
  },
  title: {
    margin: '12px 0 10px',
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    fontSize: 'clamp(36px, 5vw, 72px)',
    fontWeight: 500,
    letterSpacing: '-0.03em',
    lineHeight: 0.95
  },
  description: {
    maxWidth: 620,
    margin: 0,
    color: 'rgba(15, 23, 42, 0.64)',
    fontSize: 16,
    lineHeight: 1.65
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 14,
    marginBottom: 30
  },
  statCard: {
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 10,
    background: 'rgba(255, 253, 248, 0.72)',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.045)',
    padding: '18px 18px 20px'
  },
  statLabel: {
    display: 'block',
    color: 'rgba(15, 23, 42, 0.58)',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.12em',
    lineHeight: 1.4,
    textTransform: 'uppercase' as const
  },
  statValue: {
    display: 'block',
    marginTop: 18,
    color: '#b38a56',
    fontFamily: 'Georgia, serif',
    fontSize: 42,
    fontWeight: 500,
    lineHeight: 0.9
  },
  loadingText: {
    color: 'rgba(15, 23, 42, 0.52)',
    fontSize: 13,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const
  },
  recentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 18
  },
  recentPanel: {
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 12,
    background: 'rgba(255, 253, 248, 0.62)',
    overflow: 'hidden'
  },
  panelHead: {
    borderBottom: '1px solid rgba(179, 138, 86, 0.22)',
    padding: '18px 18px 15px'
  },
  panelKicker: {
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const
  },
  panelTitle: {
    margin: '7px 0 0',
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    fontSize: 27,
    fontWeight: 500,
    lineHeight: 1
  },
  recentList: {
    display: 'grid'
  },
  recentItem: {
    display: 'grid',
    gridTemplateColumns: '38px minmax(0, 1fr)',
    gap: 14,
    borderBottom: '1px solid rgba(221, 211, 195, 0.62)',
    padding: '15px 18px'
  },
  recentIndex: {
    color: 'rgba(179, 138, 86, 0.78)',
    fontFamily: 'Georgia, serif',
    fontSize: 18,
    lineHeight: 1
  },
  recentCopy: {
    display: 'grid',
    gap: 7
  },
  recentTitle: {
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 1.08
  },
  recentMeta: {
    color: 'rgba(15, 23, 42, 0.52)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const
  },
  emptyText: {
    margin: 0,
    color: 'rgba(15, 23, 42, 0.52)',
    padding: 18
  }
}
