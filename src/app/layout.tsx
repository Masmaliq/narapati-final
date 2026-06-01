import type { ReactNode } from 'react'
import {Cormorant_Garamond, Inter, Source_Serif_4} from 'next/font/google'
import '@/app/globals.css'
import {defaultOgImage, siteDescription, siteName, siteUrl} from '@/lib/seo'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700']
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800']
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: ['400', '500', '600', '700']
})

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
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${sourceSerif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
