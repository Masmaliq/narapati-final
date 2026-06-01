import type { ReactNode } from 'react'
import '@/app/globals.css'
import {defaultOgImage, siteDescription, siteName, siteUrl} from '@/lib/seo'

export const metadata = {
  title: siteName,
  description: siteDescription,
  applicationName: siteName,
  appleWebApp: {
    title: siteName,
    capable: true,
  },
  openGraph: {
    type: 'website',
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: [defaultOgImage],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
