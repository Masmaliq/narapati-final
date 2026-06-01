import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {Cormorant_Garamond, Inter, Spectral} from 'next/font/google'
import '@/app/globals.css'
import {Footer} from '@/components/Footer'
import {Header} from '@/components/Header'
import {ScrollReveal} from '@/components/ScrollReveal'

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

const spectral = Spectral({
  subsets: ['latin'],
  variable: '--font-spectral',
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: {
    default: 'Narapati Journal',
    template: '%s | Narapati Journal'
  },
  description: 'Premium independent journalism from Narapati Journal.'
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function SiteLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${spectral.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  )
}
