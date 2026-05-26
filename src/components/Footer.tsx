import Link from 'next/link'

const footerColumns = [
  {
    title: 'Informasi',
    links: [
      {label: 'Tentang Kami', href: '/about'},
      {label: 'Redaksi', href: '/redaksi'},
      {label: 'Karir', href: '/contact'},
      {label: 'Kontak', href: '/contact'}
    ]
  },
  {
    title: 'Kategori',
    links: [
      {label: 'Global', href: '/category/global'},
      {label: 'Insight', href: '/category/insight'},
      {label: 'Market', href: '/category/market'},
      {label: 'Video', href: '/video'},
      {label: 'Photography', href: '/photography'}
    ]
  },
  {
    title: 'Layanan',
    links: [
      {label: 'Newsletter', href: '/contact'},
      {label: 'Podcast', href: '/contact'},
      {label: 'Iklan', href: '/advertise'},
      {label: 'Kerja Sama', href: '/advertise'}
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
            <strong>News Network</strong>
            <p className="footer-identity">Capture The Moment, Keep The Story.</p>
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
