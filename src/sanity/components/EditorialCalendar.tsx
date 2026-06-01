'use client'

import {type CSSProperties, useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {apiVersion} from '@/sanity/env'

type CalendarItem = {
  _id: string
  _type: 'article' | 'video' | 'photography'
  title?: string
  publishedAt?: string
  category?: string
  author?: string
}

const calendarQuery = `*[
  _type in ["article", "video", "photography"]
] | order(publishedAt asc) {
  _id,
  _type,
  title,
  publishedAt,
  "category": select(
    _type == "article" => category->title,
    _type == "photography" => coalesce(category->title, visualCategory, "Photography"),
    _type == "video" => "Video"
  ),
  "author": select(
    _type == "article" => author->name,
    _type == "photography" => photographer->name,
    _type == "video" => "Video Journal"
  )
}`

const contentFilters = ['All', 'Global', 'Insight', 'Market', 'Video', 'Photography']
const statusFilters = ['All', 'Draft', 'Scheduled', 'Published']

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return toDateKey(date)
}

function getStatus(item: CalendarItem) {
  if (item._id.startsWith('drafts.')) return 'Draft'
  if (item.publishedAt && new Date(item.publishedAt) > new Date()) return 'Scheduled'
  return 'Published'
}

function typeLabel(item: CalendarItem) {
  if (item._type === 'video') return 'Video'
  if (item._type === 'photography') return 'Photography'
  return item.category || 'Article'
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {month: 'long', year: 'numeric'}).format(date)
}

function formatDateTime(value?: string) {
  if (!value) return 'Unscheduled'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

function buildMonthDays(currentMonth: Date) {
  const start = monthStart(currentMonth)
  const firstDay = start.getDay()
  const calendarStart = new Date(start)
  calendarStart.setDate(start.getDate() - firstDay)

  return Array.from({length: 42}, (_, index) => {
    const date = new Date(calendarStart)
    date.setDate(calendarStart.getDate() + index)
    return date
  })
}

export function EditorialCalendar() {
  const client = useClient({apiVersion})
  const [items, setItems] = useState<CalendarItem[]>([])
  const [currentMonth, setCurrentMonth] = useState(() => monthStart(new Date()))
  const [contentFilter, setContentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  function loadItems() {
    setLoading(true)
    client
      .fetch<CalendarItem[]>(calendarQuery)
      .then((result) => setItems(result || []))
      .catch((error) => console.error('Failed to load Editorial Calendar', error))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const type = typeLabel(item).toLowerCase()
      const status = getStatus(item)
      const matchesContent = contentFilter === 'All' || type.includes(contentFilter.toLowerCase())
      const matchesStatus = statusFilter === 'All' || status === statusFilter

      return matchesContent && matchesStatus
    })
  }, [contentFilter, items, statusFilter])

  const unscheduledItems = filteredItems.filter((item) => !parseDateKey(item.publishedAt))
  const days = buildMonthDays(currentMonth)
  const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`

  async function scheduleItem(itemId: string, dateKey: string) {
    const scheduledAt = new Date(`${dateKey}T02:00:00.000Z`).toISOString()

    setSavingId(itemId)
    setItems((current) => current.map((item) => item._id === itemId ? {...item, publishedAt: scheduledAt} : item))

    try {
      await client.patch(itemId).set({publishedAt: scheduledAt}).commit()
    } catch (error) {
      console.error('Failed to schedule editorial item', error)
      loadItems()
    } finally {
      setSavingId(null)
    }
  }

  return (
    <main style={styles.shell}>
      <section style={styles.hero}>
        <span style={styles.eyebrow}>Planning Desk</span>
        <h1 style={styles.title}>Editorial Calendar</h1>
        <p style={styles.description}>
          Monthly newsroom planning for articles, video journal, and photography stories across Global, Insight, and Market.
        </p>
      </section>

      <section style={styles.controls}>
        <div style={styles.monthControls}>
          <button style={styles.navButton} type="button" onClick={() => setCurrentMonth((date) => addMonths(date, -1))}>
            Prev
          </button>
          <strong style={styles.monthTitle}>{formatMonth(currentMonth)}</strong>
          <button style={styles.navButton} type="button" onClick={() => setCurrentMonth((date) => addMonths(date, 1))}>
            Next
          </button>
        </div>

        <div style={styles.filters}>
          {contentFilters.map((filter) => (
            <button
              style={filter === contentFilter ? {...styles.filterButton, ...styles.filterActive} : styles.filterButton}
              type="button"
              onClick={() => setContentFilter(filter)}
              key={filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <div style={styles.filters}>
          {statusFilters.map((filter) => (
            <button
              style={filter === statusFilter ? {...styles.filterButton, ...styles.filterActive} : styles.filterButton}
              type="button"
              onClick={() => setStatusFilter(filter)}
              key={filter}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {loading ? <p style={styles.loading}>Loading newsroom calendar...</p> : null}

      {unscheduledItems.length ? (
        <section style={styles.unscheduled}>
          <span style={styles.sectionLabel}>Unscheduled / Draft Desk</span>
          <div style={styles.unscheduledList}>
            {unscheduledItems.map((item) => (
              <CalendarChip item={item} saving={savingId === item._id} key={item._id} />
            ))}
          </div>
        </section>
      ) : null}

      <section style={styles.calendar} aria-label="Monthly editorial calendar">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div style={styles.weekday} key={day}>{day}</div>
        ))}

        {days.map((day) => {
          const dateKey = toDateKey(day)
          const dayItems = filteredItems.filter((item) => parseDateKey(item.publishedAt) === dateKey)
          const outsideMonth = day.getMonth() !== currentMonth.getMonth()

          return (
            <div
              style={outsideMonth ? {...styles.dayCell, ...styles.dayCellMuted} : styles.dayCell}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const itemId = event.dataTransfer.getData('text/plain')
                if (itemId) scheduleItem(itemId, dateKey)
              }}
              key={`${monthKey}-${dateKey}`}
            >
              <span style={styles.dayNumber}>{day.getDate()}</span>
              <div style={styles.dayItems}>
                {dayItems.map((item) => (
                  <CalendarChip item={item} saving={savingId === item._id} key={item._id} />
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}

function CalendarChip({item, saving}: {item: CalendarItem; saving: boolean}) {
  const status = getStatus(item)

  return (
    <article
      draggable
      onDragStart={(event) => event.dataTransfer.setData('text/plain', item._id)}
      style={{
        ...styles.chip,
        ...(status === 'Draft' ? styles.chipDraft : {}),
        ...(status === 'Scheduled' ? styles.chipScheduled : {})
      }}
      title="Drag to reschedule"
    >
      <span style={styles.chipMeta}>{status} · {typeLabel(item)} · {formatDateTime(item.publishedAt)}</span>
      <strong style={styles.chipTitle}>{item.title || 'Untitled'}</strong>
      <span style={styles.chipByline}>{item.author || 'Narapati Desk'}</span>
      {saving ? <span style={styles.saving}>Saving...</span> : null}
    </article>
  )
}

const styles: Record<string, CSSProperties> = {
  shell: {
    minHeight: '100%',
    background: 'linear-gradient(180deg, #fbf8f2 0%, #f6f1e8 100%)',
    color: '#0f172a',
    fontFamily: 'var(--font-sans)',
    padding: 'clamp(24px, 4vw, 48px)'
  },
  hero: {
    maxWidth: 860,
    borderBottom: '1px solid rgba(179, 138, 86, 0.28)',
    marginBottom: 22,
    paddingBottom: 22
  },
  eyebrow: {
    color: '#b38a56',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.22em',
    textTransform: 'uppercase'
  },
  title: {
    margin: '10px 0',
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(36px, 5vw, 70px)',
    fontWeight: 500,
    letterSpacing: '-0.035em',
    lineHeight: 0.95
  },
  description: {
    maxWidth: 660,
    margin: 0,
    color: 'rgba(15, 23, 42, 0.64)',
    fontSize: 16,
    lineHeight: 1.6
  },
  controls: {
    display: 'grid',
    gap: 12,
    marginBottom: 18
  },
  monthControls: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  monthTitle: {
    color: '#0f172a',
    fontFamily: 'var(--font-serif)',
    fontSize: 28,
    fontWeight: 500
  },
  navButton: {
    border: '1px solid rgba(179, 138, 86, 0.32)',
    borderRadius: 999,
    background: 'rgba(255, 253, 248, 0.7)',
    color: '#0f172a',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.12em',
    padding: '9px 14px',
    textTransform: 'uppercase'
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  },
  filterButton: {
    border: '1px solid rgba(179, 138, 86, 0.24)',
    borderRadius: 999,
    background: 'rgba(255, 253, 248, 0.56)',
    color: 'rgba(15, 23, 42, 0.62)',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.1em',
    padding: '8px 12px',
    textTransform: 'uppercase'
  },
  filterActive: {
    background: '#0f172a',
    borderColor: '#0f172a',
    color: '#f5f2ea'
  },
  loading: {
    color: 'rgba(15, 23, 42, 0.52)',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  },
  unscheduled: {
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 12,
    background: 'rgba(255, 253, 248, 0.62)',
    marginBottom: 18,
    padding: 16
  },
  sectionLabel: {
    display: 'block',
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.16em',
    marginBottom: 12,
    textTransform: 'uppercase'
  },
  unscheduledList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 10
  },
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(132px, 1fr))',
    overflowX: 'auto',
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 14,
    background: 'rgba(255, 253, 248, 0.58)'
  },
  weekday: {
    borderBottom: '1px solid rgba(179, 138, 86, 0.24)',
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: '0.16em',
    padding: '12px 10px',
    textTransform: 'uppercase'
  },
  dayCell: {
    minHeight: 160,
    borderRight: '1px solid rgba(221, 211, 195, 0.76)',
    borderBottom: '1px solid rgba(221, 211, 195, 0.76)',
    padding: 10
  },
  dayCellMuted: {
    background: 'rgba(246, 241, 232, 0.48)',
    color: 'rgba(15, 23, 42, 0.34)'
  },
  dayNumber: {
    display: 'block',
    color: 'rgba(15, 23, 42, 0.6)',
    fontFamily: 'var(--font-serif)',
    fontSize: 19,
    marginBottom: 8
  },
  dayItems: {
    display: 'grid',
    gap: 8
  },
  chip: {
    border: '1px solid rgba(179, 138, 86, 0.26)',
    borderRadius: 9,
    background: 'rgba(255, 253, 248, 0.86)',
    cursor: 'grab',
    display: 'grid',
    gap: 5,
    padding: 10,
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.045)'
  },
  chipDraft: {
    borderColor: 'rgba(15, 23, 42, 0.22)'
  },
  chipScheduled: {
    borderColor: 'rgba(179, 138, 86, 0.5)'
  },
  chipMeta: {
    color: '#b38a56',
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
  },
  chipTitle: {
    color: '#0f172a',
    fontFamily: 'var(--font-serif)',
    fontSize: 15,
    fontWeight: 500,
    lineHeight: 1.05
  },
  chipByline: {
    color: 'rgba(15, 23, 42, 0.52)',
    fontSize: 11,
    lineHeight: 1.3
  },
  saving: {
    color: 'rgba(15, 23, 42, 0.48)',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
  }
}
