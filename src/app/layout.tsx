import type { ReactNode } from 'react'
import '@/app/globals.css'

export const metadata = {
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}