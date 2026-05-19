import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="brand">
          <span className="brand-mark">NNN</span>
          <span className="brand-sub">Narapati News Network / Nilai Hidup</span>
        </div>
        <div className="footer-links">
          <Link href="/redaksi">Redaksi</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/studio">Studio</Link>
        </div>
      </div>
    </footer>
  )
}
