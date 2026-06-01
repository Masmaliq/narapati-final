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
  publishedThisMonth: number
  draftsWaitingReview: number
  recentlyUpdated: number
  mostViewedArticle?: string
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
  "publishedThisMonth": count(*[_type == "article" && !(_id in path("drafts.**")) && publishedAt >= dateTime(now()) - 60*60*24*30]),
  "draftsWaitingReview": count(*[_type == "article" && _id in path("drafts.**")]),
  "recentlyUpdated": count(*[_updatedAt >= dateTime(now()) - 60*60*24*7 && _type in ["article", "photography", "video"]]),
  "mostViewedArticle": *[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc)[0].title,
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
    "category": "Visual Journal"
  }
}`

const fallbackData: DashboardData = {
  totalArticles: 0,
  publishedArticles: 0,
  draftArticles: 0,
  photographyPosts: 0,
  videoPosts: 0,
  publishedThisMonth: 0,
  draftsWaitingReview: 0,
  recentlyUpdated: 0,
  mostViewedArticle: '',
  recentArticles: [],
  recentPhotography: [],
  recentVideos: []
}

const quickActions = [
  {label: 'New Article', href: '/studio/intent/create/template=article'},
  {label: 'New Visual Journal', href: '/studio/intent/create/template=video'},
  {label: 'New Photography', href: '/studio/intent/create/template=photography'},
  {label: 'Upload Media', href: '/studio/intent/create/template=photography'}
]

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
      <strong style={styles.statValue}>{value}</strong>
      <span style={styles.statLabel}>{label}</span>
    </article>
  )
}

function RecentList({title, items}: {title: string; items: RecentItem[]}) {
  return (
    <section style={styles.recentPanel}>
      <div style={styles.panelHead}>
        <span style={styles.panelKicker}>Latest</span>
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

function activityItems(data: DashboardData) {
  return [
    data.recentArticles[0]?.title ? `Artikel terbaru dipublikasikan: ${data.recentArticles[0].title}` : '',
    data.recentVideos[0]?.title ? `Visual journal diperbarui: ${data.recentVideos[0].title}` : '',
    data.recentPhotography[0]?.title ? `Media baru diunggah: ${data.recentPhotography[0].title}` : '',
    data.draftArticles ? `${data.draftArticles} draft menunggu review` : ''
  ].filter(Boolean)
}

const calendarRhythm = [
  ['Senin', 'Insight'],
  ['Rabu', 'Global'],
  ['Jumat', 'Market'],
  ['Minggu', 'Visual Journal']
]

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
      <style>{`
        .narapati-desk-quick-action:hover {
          border-color: #b38a56 !important;
          background: #b38a56 !important;
          color: #0f172a !important;
        }
      `}</style>
      <section style={styles.hero}>
        <span style={styles.eyebrow}>Narapati Studio</span>
        <div style={styles.greeting}>
          <strong style={styles.greetingTitle}>Selamat datang, Maliq.</strong>
          <span style={styles.greetingText}>Kelola ritme tulisan, visual journal, dan arsip Narapati hari ini.</span>
        </div>
        <h1 style={styles.title}>Editorial Desk</h1>
        <p style={styles.description}>
          Ruang kerja editorial untuk mengelola tulisan, visual journal, fotografi, dan narasi Narapati.
        </p>
      </section>

      <section style={styles.quickPanel} aria-label="Quick create">
        <div>
          <span style={styles.sectionLabel}>Quick Create</span>
          <h2 style={styles.quickTitle}>Mulai cerita baru</h2>
        </div>
        <div style={styles.quickActions}>
          {quickActions.map((action) => (
            <a className="narapati-desk-quick-action" style={styles.quickButton} href={action.href} key={action.label}>
              {action.label}
            </a>
          ))}
        </div>
      </section>

      <section style={styles.statsGrid} aria-label="Editorial statistics">
        <StatCard label="Published" value={data.publishedArticles} />
        <StatCard label="Draft" value={data.draftArticles} />
        <StatCard label="Photography" value={data.photographyPosts} />
        <StatCard label="Visual Journal" value={data.videoPosts} />
      </section>

      <section style={styles.rhythmGrid} aria-label="Editorial rhythm">
        <section style={styles.overviewPanel} aria-label="Latest activity">
          <div style={styles.panelHead}>
            <span style={styles.panelKicker}>Rhythm</span>
            <h2 style={styles.panelTitle}>Latest Activity</h2>
          </div>
          <div style={styles.activityList}>
            {activityItems(data).length ? (
              activityItems(data).map((item, index) => (
                <article style={styles.activityItem} key={`${item}-${index}`}>
                  <span style={styles.activityDot} />
                  <strong style={styles.activityText}>{item}</strong>
                </article>
              ))
            ) : (
              <p style={styles.emptyText}>Belum ada aktivitas terbaru.</p>
            )}
          </div>
        </section>

        <section style={styles.overviewPanel} aria-label="Editorial calendar">
          <div style={styles.panelHead}>
            <span style={styles.panelKicker}>Calendar</span>
            <h2 style={styles.panelTitle}>Editorial Calendar</h2>
          </div>
          <div style={styles.calendarList}>
            {calendarRhythm.map(([day, desk]) => (
              <article style={styles.calendarItem} key={day}>
                <span style={styles.calendarDay}>{day}</span>
                <strong style={styles.calendarDesk}>{desk}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>

      {loading ? <p style={styles.loadingText}>Loading editorial desk...</p> : null}

      <section style={styles.recentGrid}>
        <RecentList title="Latest Journal Entries" items={data.recentArticles} />
        <RecentList title="Latest Photography" items={data.recentPhotography} />
        <RecentList title="Latest Visual Journal" items={data.recentVideos} />
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
    maxWidth: 860,
    borderBottom: '1px solid rgba(179, 138, 86, 0.28)',
    marginBottom: 24,
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
    margin: '14px 0 10px',
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    fontSize: 'clamp(42px, 5vw, 76px)',
    fontWeight: 500,
    letterSpacing: '-0.03em',
    lineHeight: 0.95
  },
  description: {
    maxWidth: 680,
    margin: 0,
    color: 'rgba(15, 23, 42, 0.64)',
    fontSize: 16,
    lineHeight: 1.65
  },
  greeting: {
    display: 'grid',
    gap: 5,
    marginTop: 18,
    color: 'rgba(15, 23, 42, 0.66)'
  },
  greetingTitle: {
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    fontSize: 22,
    fontWeight: 500,
    lineHeight: 1.08
  },
  greetingText: {
    color: 'rgba(15, 23, 42, 0.58)',
    fontSize: 14,
    lineHeight: 1.5
  },
  quickPanel: {
    display: 'grid',
    gridTemplateColumns: 'minmax(220px, 0.8fr) minmax(0, 1.6fr)',
    gap: 18,
    alignItems: 'center',
    border: '1px solid rgba(179, 138, 86, 0.28)',
    borderRadius: 16,
    background: 'rgba(255, 253, 248, 0.78)',
    boxShadow: '0 22px 60px rgba(15, 23, 42, 0.045)',
    marginBottom: 18,
    padding: '20px clamp(18px, 3vw, 28px)'
  },
  sectionLabel: {
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const
  },
  quickTitle: {
    margin: '7px 0 0',
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    fontSize: 28,
    fontWeight: 500,
    lineHeight: 1
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 10
  },
  quickButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    border: '1px solid #0b1b3b',
    borderRadius: 999,
    background: '#0b1b3b',
    color: '#fbf8f2',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    padding: '0 12px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
    transition: 'background 220ms ease, border-color 220ms ease, color 220ms ease'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 14,
    marginBottom: 18
  },
  statCard: {
    display: 'grid',
    gap: 12,
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 12,
    background: 'rgba(255, 253, 248, 0.68)',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.035)',
    padding: '22px 20px 18px'
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
    color: '#b38a56',
    fontFamily: 'Georgia, serif',
    fontSize: 56,
    fontWeight: 500,
    lineHeight: 0.86
  },
  overviewPanel: {
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 14,
    background: 'rgba(255, 253, 248, 0.62)',
    marginBottom: 22,
    overflow: 'hidden'
  },
  rhythmGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.35fr) minmax(260px, 0.85fr)',
    gap: 18,
    marginBottom: 22
  },
  activityList: {
    display: 'grid'
  },
  activityItem: {
    display: 'grid',
    gridTemplateColumns: '10px minmax(0, 1fr)',
    gap: 12,
    alignItems: 'start',
    borderTop: '1px solid rgba(221, 211, 195, 0.62)',
    padding: '14px 18px'
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: '#b38a56',
    marginTop: 8
  },
  activityText: {
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 1.18
  },
  calendarList: {
    display: 'grid'
  },
  calendarItem: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 18,
    borderTop: '1px solid rgba(221, 211, 195, 0.62)',
    padding: '14px 18px'
  },
  calendarDay: {
    display: 'block',
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const
  },
  calendarDesk: {
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 1.08,
    textAlign: 'right' as const
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
    borderRadius: 14,
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
