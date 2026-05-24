'use client'

import {useState} from 'react'
import type {RedaksiContent} from '@/content/redaksi'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

type RedaksiEditorProps = {
  initialContent: RedaksiContent
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

export function RedaksiEditor({initialContent}: RedaksiEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  function updateField(field: keyof Omit<RedaksiContent, 'cards'>, value: string) {
    setContent((current) => ({...current, [field]: value}))
  }

  function updateCard(index: number, field: 'label' | 'title' | 'description', value: string) {
    setContent((current) => ({
      ...current,
      cards: current.cards.map((card, cardIndex) => (
        cardIndex === index ? {...card, [field]: value} : card
      ))
    }))
  }

  function addCard() {
    setContent((current) => ({
      ...current,
      cards: [
        ...current.cards,
        {
          label: 'LABEL BARU',
          title: 'Judul Kartu',
          description: 'Deskripsi singkat kartu redaksi.'
        }
      ]
    }))
  }

  function removeCard(index: number) {
    setContent((current) => ({
      ...current,
      cards: current.cards.filter((_, cardIndex) => cardIndex !== index)
    }))
  }

  async function handleSave() {
    setSaveState('saving')

    try {
      const response = await fetch('/api/redaksi', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(content)
      })

      if (!response.ok) {
        throw new Error('Save failed')
      }

      const result = await response.json() as {content: RedaksiContent}
      setContent(result.content)
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  function handleInput(field: keyof Omit<RedaksiContent, 'cards'>) {
    return (value: string) => updateField(field, value)
  }

  return (
    <div className="admin-editor-shell">
      <div className="admin-editor-toolbar">
        <div>
          <span>Internal Admin</span>
          <h1>Edit Redaksi</h1>
          <p>Ubah teks di form ini, lalu klik Save. Halaman /redaksi akan memakai konten terbaru.</p>
        </div>
        <button className="admin-save-button" type="button" onClick={handleSave} disabled={saveState === 'saving'}>
          {saveState === 'saving' ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {saveState === 'saved' ? <p className="admin-status admin-status-success">Konten Redaksi berhasil disimpan.</p> : null}
      {saveState === 'error' ? <p className="admin-status admin-status-error">Konten gagal disimpan. Coba lagi.</p> : null}

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <span>Hero</span>
          <h2>Hero Section</h2>
        </div>
        <div className="admin-form-grid">
          <Field label="Hero label" value={content.heroLabel} onChange={handleInput('heroLabel')} />
          <Field label="Hero title" value={content.heroTitle} onChange={handleInput('heroTitle')} />
          <Field label="Hero description" value={content.heroDescription} onChange={handleInput('heroDescription')} multiline />
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <span>Intro</span>
          <h2>Intro Section</h2>
        </div>
        <div className="admin-form-grid">
          <Field label="Intro label" value={content.introLabel} onChange={handleInput('introLabel')} />
          <Field label="Intro title" value={content.introTitle} onChange={handleInput('introTitle')} />
          <Field label="Intro text" value={content.introDescription} onChange={handleInput('introDescription')} multiline />
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <span>Masthead</span>
          <h2>Masthead Section</h2>
        </div>
        <div className="admin-form-grid">
          <Field label="Masthead label" value={content.mastheadLabel} onChange={handleInput('mastheadLabel')} />
          <Field label="Masthead title" value={content.mastheadTitle} onChange={handleInput('mastheadTitle')} />
        </div>

        <div className="admin-card-list">
          {content.cards.map((card, index) => (
            <article className="admin-card-editor" key={`${card.title}-${index}`}>
              <div className="admin-card-editor-heading">
                <strong>Card {index + 1}</strong>
                <button type="button" onClick={() => removeCard(index)}>Remove</button>
              </div>
              <Field label={`Card ${index + 1} label`} value={card.label} onChange={(value) => updateCard(index, 'label', value)} />
              <Field label={`Card ${index + 1} title`} value={card.title} onChange={(value) => updateCard(index, 'title', value)} />
              <Field
                label={`Card ${index + 1} description`}
                value={card.description}
                onChange={(value) => updateCard(index, 'description', value)}
                multiline
              />
            </article>
          ))}
        </div>

        <button className="admin-secondary-button" type="button" onClick={addCard}>Add card</button>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <span>Ethics</span>
          <h2>Ethics Section</h2>
        </div>
        <div className="admin-form-grid">
          <Field label="Ethics title" value={content.ethicsTitle} onChange={handleInput('ethicsTitle')} />
          <Field label="Ethics description" value={content.ethicsDescription} onChange={handleInput('ethicsDescription')} multiline />
          <Field label="Ethics contact text" value={content.ethicsContactText} onChange={handleInput('ethicsContactText')} multiline />
        </div>
      </section>
    </div>
  )
}
