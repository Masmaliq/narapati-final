'use client'

import {useEffect, useMemo, useState} from 'react'
import {Link2} from 'lucide-react'

type ArticleShareBarProps = {
  title: string
  url: string
  placement?: 'desktop' | 'mobile'
  instagram?: string
  tiktok?: string
  youtube?: string
}

type ShareItem = {
  label: string
  shortLabel: string
  variant: string
  href?: string
  action?: 'copy'
}

function encoded(value: string) {
  return encodeURIComponent(value)
}

export function ArticleShareBar({title, url, placement = 'desktop', instagram, tiktok, youtube}: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState(url)
  const shareUrl = currentUrl || url

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const items = useMemo<ShareItem[]>(() => {
    const shareText = `${title} — ${shareUrl}`

    return [
      {
        label: 'Bagikan ke WhatsApp',
        shortLabel: 'WA',
        variant: 'whatsapp',
        href: `https://wa.me/?text=${encoded(shareText)}`
      },
      {
        label: 'Bagikan ke Facebook',
        shortLabel: 'FB',
        variant: 'facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encoded(shareUrl)}`
      },
      {
        label: 'Bagikan ke X',
        shortLabel: 'X',
        variant: 'x',
        href: `https://twitter.com/intent/tweet?text=${encoded(title)}&url=${encoded(shareUrl)}`
      },
      {
        label: 'Salin link',
        shortLabel: '',
        variant: 'copy',
        action: 'copy'
      },
      instagram ? {label: 'Instagram Narapati', shortLabel: 'IG', variant: 'instagram', href: instagram} : null,
      tiktok ? {label: 'TikTok Narapati', shortLabel: 'TT', variant: 'tiktok', href: tiktok} : null,
      youtube ? {label: 'YouTube Narapati', shortLabel: 'YT', variant: 'youtube', href: youtube} : null
    ].filter(Boolean) as ShareItem[]
  }, [instagram, shareUrl, tiktok, title, youtube])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <nav className={`article-share article-share-${placement}`} aria-label="Bagikan artikel">
      <div className="article-share-list">
        {items.map((item) => item.action === 'copy' ? (
          <button className={`article-share-button article-share-${item.variant}`} type="button" onClick={copyLink} aria-label={item.label} key={item.label}>
            <Link2 size={17} strokeWidth={1.8} />
          </button>
        ) : (
          <a
            className={`article-share-button article-share-${item.variant}`}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            key={item.label}
          >
            {item.shortLabel}
          </a>
        ))}
      </div>
      <span className={`article-share-feedback${copied ? ' is-visible' : ''}`} role="status">
        Link tersalin
      </span>
    </nav>
  )
}
