import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {Cormorant_Garamond, Inter} from 'next/font/google'
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

export const metadata: Metadata = {
  title: {
    default: 'Narapati News Network',
    template: '%s | Narapati News Network'
  },
  description: 'Premium independent journalism from Narapati News Network.'
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function SiteLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  )
}
