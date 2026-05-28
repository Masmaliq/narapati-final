import Link from 'next/link'
import {Instagram, Music2, Youtube} from 'lucide-react'

const footerLinks = [
  {label: 'About', href: '/about'},
  {label: 'Redaksi', href: '/redaksi'},
  {label: 'Contact', href: '/contact'},
  {label: 'Advertise Content', href: '/advertise'}
]

const socialLinks = [
  {label: 'Instagram', href: '#', icon: Instagram},
  {label: 'YouTube', href: '#', icon: Youtube},
  {label: 'TikTok', href: '#', icon: Music2}
]

export function Footer() {
  return (
    <footer className="site-footer luxury-footer">
      <div className="container luxury-footer-inner">
        <Link href="/" className="luxury-footer-monogram" aria-label="Narapati home">
          N
        </Link>

        <p className="luxury-footer-kicker">Journal of a Modern Wanderer</p>

        <p className="luxury-footer-quote">
          Tentang dunia, manusia,<br />
          dan perjalanan memahami kehidupan.
        </p>

        <nav className="luxury-footer-social" aria-label="Social media">
          {socialLinks.map(({label, href, icon: Icon}) => (
            <a href={href} aria-label={label} key={label}>
              <Icon size={16} strokeWidth={1.45} />
            </a>
          ))}
        </nav>

        <nav className="luxury-footer-nav" aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <Link href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="luxury-footer-copy">© Narapati Journal — Indonesia 2026</p>
      </div>
    </footer>
  )
}
