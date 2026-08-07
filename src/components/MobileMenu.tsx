'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {Menu, X} from 'lucide-react'
import type {NavigationItem} from '@/types/content'

type MobileMenuProps = {
  navItems: NavigationItem[]
}

const secondaryLinks: Array<[string, string]> = [
  ['About', '/about'],
  ['Redaksi', '/redaksi'],
  ['Contact', '/contact']
]

export function MobileMenu({navItems}: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const overlay = open
    ? createPortal(
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true" aria-label="Narapati mobile menu">
          <div className="mobile-menu-panel">
            <div className="mobile-menu-head">
              <span>Narapati</span>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X size={20} strokeWidth={1.6} />
              </button>
            </div>

            <nav className="mobile-menu-primary" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  href={item.href}
                  key={`${item.label}-${item.href}`}
                  className={item.highlight ? 'mobile-menu-highlight' : undefined}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noreferrer' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.mobileLabel || item.label}
                </Link>
              ))}
            </nav>

            <nav className="mobile-menu-secondary" aria-label="Company navigation">
              {secondaryLinks.map(([label, href]) => (
                <Link href={href} key={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <>
      <button
        className="header-menu-button"
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu size={18} strokeWidth={1.7} />
      </button>

      {overlay}
    </>
  )
}
