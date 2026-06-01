import type {MetadataRoute} from 'next'
import {siteDescription, siteName} from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f1e8',
    theme_color: '#0b1b3b',
    icons: [
      {
        src: '/favicon.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  }
}
