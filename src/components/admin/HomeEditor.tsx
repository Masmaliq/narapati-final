'use client'

import {useState} from 'react'
import type {HomeContent} from '@/content/home'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

type HomeEditorProps = {
  initialContent: HomeContent
}

function Field({
  label,
  value,
  onChange,
  multiline = false
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}) {
  const fieldId = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  if (multiline) {
    return (
      <label className="admin-field" htmlFor={fieldId}>
        <span>{label}</span>
        <textarea id={fieldId} value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      </label>
    )
  }

  return (
    <label className="admin-field" htmlFor={fieldId}>
      <span>{label}</span>
      <input id={fieldId} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export function HomeEditor({initialContent}: HomeEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  function updateField(field: keyof HomeContent, value: string) {
    setContent((current) => ({...current, [field]: value}))
  }

  async function handleSave() {
    setSaveState('saving')

    try {
      const response = await fetch('/api/home', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(content)
      })

      if (!response.ok) {
        throw new Error('Save failed')
      }

      const result = await response.json() as {content: HomeContent}
      setContent(result.content)
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  return (
    <div className="admin-editor-shell">
      <div className="admin-editor-toolbar">
        <div>
          <span>Internal Admin</span>
          <h1>Edit Homepage</h1>
          <p>Ubah konten quote homepage dari form ini, lalu klik Save. Homepage akan memakai konten terbaru setelah refresh.</p>
        </div>
        <button className="admin-save-button" type="button" onClick={handleSave} disabled={saveState === 'saving'}>
          {saveState === 'saving' ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {saveState === 'saved' ? <p className="admin-status admin-status-success">Konten homepage berhasil disimpan.</p> : null}
      {saveState === 'error' ? <p className="admin-status admin-status-error">Konten gagal disimpan. Coba lagi.</p> : null}

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <span>Quote Strip</span>
          <h2>Homepage Quote</h2>
        </div>
        <div className="admin-form-grid">
          <Field label="Quote Text" value={content.quoteText} onChange={(value) => updateField('quoteText', value)} multiline />
          <Field label="Quote Source" value={content.quoteSource} onChange={(value) => updateField('quoteSource', value)} />
        </div>
      </section>
    </div>
  )
}
