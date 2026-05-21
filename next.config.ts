import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['sanity', 'next-sanity', '@sanity/vision'],
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'images.unsplash.com'},
      {protocol: 'https', hostname: 'cdn.sanity.io'}
    ]
  }
}

export default nextConfig
