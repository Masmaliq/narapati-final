import Link from 'next/link'
import {getCategories, getSiteSettings} from '@/sanity/lib/fetch'

const footerContent = {
  logoText: 'NNN',
  columns: {
    menuTitle: 'Menu',
    categoryTitle: 'Kategori',
    companyTitle: 'Perusahaan',
    socialTitle: 'Social'
  },
  fallbackSocial: {
    label: 'Contact',
    href: '/contact'
  },
  menuLinks: [
    {label: 'Home', href: '/'},
    {label: 'Video', href: '/video'},
    {label: 'Photography', href: '/photography'},
    {label: 'About', href: '/about'}
  ],
  companyLinks: [
    {label: 'Redaksi', href: '/redaksi'},
    {label: 'Contact', href: '/contact'},
    {label: 'Advertise', href: '/advertise'},
    {label: 'Privacy', href: '/privacy'}
  ],
  policyLinks: [
    {label: 'Kebijakan Privasi', href: '/privacy'},
    {label: 'Kode Etik', href: '/redaksi'},
    {label: 'Kontak', href: '/contact'}
  ]
}

export async function Footer() {
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()])
  const categoryLinks = categories.slice(0, 6).map((category) => ({
    label: category.title,
    href: `/category/${encodeURIComponent(category.slug)}`
  }))
  const socialLinks = [
    {label: 'Instagram', href: settings.instagram},
    {label: 'YouTube', href: settings.youtube},
    {label: 'LinkedIn', href: settings.linkedin},
    {label: 'X', href: settings.twitterX}
  ].filter((item) => Boolean(item.href))

  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <div className="footer-main">
          <div className="footer-brand">
            <span>{footerContent.logoText}</span>
            <strong>{settings.siteTitle}</strong>
            <p>{settings.description || settings.tagline}</p>
          </div>

          <nav className="footer-column" aria-label="Footer menu">
            <h2>{footerContent.columns.menuTitle}</h2>
            {footerContent.menuLinks.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
          </nav>

          <nav className="footer-column" aria-label="Footer categories">
            <h2>{footerContent.columns.categoryTitle}</h2>
            {categoryLinks.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
          </nav>

          <nav className="footer-column" aria-label="Company links">
            <h2>{footerContent.columns.companyTitle}</h2>
            {footerContent.companyLinks.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
          </nav>

          <nav className="footer-column" aria-label="Social links">
            <h2>{footerContent.columns.socialTitle}</h2>
            {socialLinks.length ? socialLinks.map((item) => (
              <a href={item.href} key={item.label} target="_blank" rel="noreferrer">{item.label}</a>
            )) : (
              <Link href={footerContent.fallbackSocial.href}>{footerContent.fallbackSocial.label}</Link>
            )}
          </nav>
        </div>

        <div className="footer-bottom">
          <small>{settings.footerCopyright}</small>
          <div className="footer-bottom-links">
            {footerContent.policyLinks.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
