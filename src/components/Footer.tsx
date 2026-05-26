import Link from 'next/link'

const footerColumns = [
  {
    title: 'Journal',
    links: [
      {label: 'Tentang Kami', href: '/about'},
      {label: 'Redaksi', href: '/redaksi'},
      {label: 'Kontak', href: '/contact'}
    ]
  },
  {
    title: 'Explore',
    links: [
      {label: 'Global', href: '/category/global'},
      {label: 'Insight', href: '/category/insight'},
      {label: 'Market', href: '/category/market'},
      {label: 'Video', href: '/video'},
      {label: 'Photography', href: '/photography'}
    ]
  },
  {
    title: 'Resources',
    links: [
      {label: 'Iklan', href: '/advertise'},
      {label: 'Kerja Sama', href: '/advertise'},
      {label: 'Newsletter', href: '/contact'}
    ]
  },
  {
    title: 'Legal',
    links: [
      {label: 'Kebijakan Privasi', href: '/privacy'},
      {label: 'Syarat & Ketentuan', href: '/privacy'},
      {label: 'Pedoman Komunitas', href: '/redaksi'}
    ]
  }
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <div className="footer-main">
          <div className="footer-brand">
            <span>Narapati</span>
            <strong>Journal of a Modern Wanderer</strong>
            <p className="footer-identity">Tentang dunia, manusia, dan perjalanan memahami kehidupan.</p>
          </div>

          {footerColumns.map((column) => (
            <nav className="footer-column" aria-label={column.title} key={column.title}>
              <h2>{column.title}</h2>
              {column.links.map((item) => (
                <Link href={item.href} key={item.label}>{item.label}</Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <small>© 2026 Narapati News Network. All rights reserved.</small>
        </div>
      </div>
    </footer>
  )
}
