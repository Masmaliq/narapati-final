import Link from 'next/link'
import {Search} from 'lucide-react'

const navItems = [
  ['Nasional', '/category/nasional'],
  ['Global', '/category/global'],
  ['Business', '/category/business'],
  ['Culture', '/category/culture'],
  ['Podcast', '/podcast'],
  ['Video', '/video']
]

export function Header() {
  return (
    <header className="site-header">
      <div className="container topbar">
        <Link href="/" className="brand" aria-label="Narapati News Network home">
          <span className="brand-mark">NNN</span>
          <span className="brand-sub">
            <span>Narapati</span>
            <span>News Network</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
          <Link href="/about">About</Link>
          <span className="edition" aria-label="Search">
            <Search size={16} />
            Jakarta
          </span>
        </nav>
      </div>
    </header>
  )
}
