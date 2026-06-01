'use client'

import type {StringInputProps, TextInputProps} from 'sanity'

type DocumentWithEditorialData = {
  document?: {
    body?: unknown[]
    status?: string
    _updatedAt?: string
  }
}

const workflow = [
  {label: 'Draft', value: 'draft'},
  {label: 'Review', value: 'review'},
  {label: 'Scheduled', value: 'scheduled'},
  {label: 'Published', value: 'published'},
  {label: 'Archived', value: 'archived'}
]

function countPortableTextWords(value: unknown): number {
  if (!Array.isArray(value)) return 0

  const text = value
    .flatMap((block) => {
      if (!block || typeof block !== 'object' || !('children' in block)) return []
      const children = (block as {children?: unknown[]}).children
      if (!Array.isArray(children)) return []

      return children.map((child) => {
        if (!child || typeof child !== 'object' || !('text' in child)) return ''
        return String((child as {text?: string}).text || '')
      })
    })
    .join(' ')
    .trim()

  return text ? text.split(/\s+/).filter(Boolean).length : 0
}

function formatLastSaved(value?: string) {
  if (!value) return 'Belum tersimpan'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

export function SeoTitleCounter(props: StringInputProps) {
  const count = props.value?.length || 0

  return (
    <div>
      {props.renderDefault(props)}
      <p style={styles.counter}>{count}/70 karakter</p>
    </div>
  )
}

export function SeoDescriptionCounter(props: TextInputProps) {
  const count = props.value?.length || 0

  return (
    <div>
      {props.renderDefault(props)}
      <p style={styles.counter}>{count}/160 karakter</p>
    </div>
  )
}

export function WritingStatsInput(props: StringInputProps) {
  const document = (props as StringInputProps & DocumentWithEditorialData).document
  const words = countPortableTextWords(document?.body)
  const minutes = Math.max(1, Math.ceil(words / 180))

  return (
    <div style={styles.panel}>
      <span style={styles.kicker}>Writing Tools</span>
      <div style={styles.statsGrid}>
        <span>
          <strong>{words}</strong>
          Word Count
        </span>
        <span>
          <strong>{minutes} min</strong>
          Reading Time
        </span>
        <span>
          <strong>{formatLastSaved(document?._updatedAt)}</strong>
          Last Saved
        </span>
      </div>
      <p style={styles.note}>Sanity menyimpan perubahan otomatis. Gunakan statistik ini sebagai ritme sunyi sebelum publikasi.</p>
    </div>
  )
}

export function StatusWorkflowInput(props: StringInputProps) {
  const document = (props as StringInputProps & DocumentWithEditorialData).document
  const current = document?.status || 'draft'

  return (
    <div style={styles.panel}>
      <span style={styles.kicker}>Editorial Status</span>
      <div style={styles.workflow}>
        {workflow.map((item, index) => (
          <span
            style={current === item.value ? {...styles.workflowItem, ...styles.workflowItemActive} : styles.workflowItem}
            key={item.value}
          >
            {item.label}
            {index < workflow.length - 1 ? <small>↓</small> : null}
          </span>
        ))}
      </div>
    </div>
  )
}

const styles = {
  counter: {
    margin: '8px 0 0',
    color: 'rgba(15, 23, 42, 0.52)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const
  },
  panel: {
    border: '1px solid rgba(179, 138, 86, 0.22)',
    borderRadius: 14,
    background: 'linear-gradient(180deg, rgba(251, 248, 242, 0.95), rgba(246, 241, 232, 0.78))',
    color: '#0f172a',
    fontFamily: 'var(--font-sans)',
    padding: 18
  },
  kicker: {
    display: 'block',
    color: '#b38a56',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.16em',
    marginBottom: 12,
    textTransform: 'uppercase' as const
  },
  statsGrid: {
    display: 'grid',
    gap: 10
  },
  note: {
    margin: '14px 0 0',
    color: 'rgba(15, 23, 42, 0.58)',
    fontSize: 13,
    lineHeight: 1.55
  },
  workflow: {
    display: 'grid',
    gap: 8
  },
  workflowItem: {
    alignItems: 'center',
    border: '1px solid rgba(221, 211, 195, 0.92)',
    borderRadius: 999,
    color: 'rgba(15, 23, 42, 0.52)',
    display: 'flex',
    fontSize: 11,
    fontWeight: 800,
    justifyContent: 'space-between',
    letterSpacing: '0.1em',
    padding: '9px 12px',
    textTransform: 'uppercase' as const
  },
  workflowItemActive: {
    borderColor: 'rgba(179, 138, 86, 0.42)',
    background: 'rgba(179, 138, 86, 0.12)',
    color: '#8d642e'
  }
}
