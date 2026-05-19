import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import '@/app/globals.css'
import {Footer} from '@/components/Footer'
import {Header} from '@/components/Header'

export const metadata: Metadata = {
  title: {
    default: 'Narapati News Network',
    template: '%s | Narapati News Network'
  },
  description: 'Premium independent journalism from Narapati News Network.'
}

export default function SiteLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
