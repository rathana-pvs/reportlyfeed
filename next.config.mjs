import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.aljazeera.com' },
      { protocol: 'https', hostname: 'cdn.aljazeera.net' },
      { protocol: 'https', hostname: 'reportlyfeed.com' },
      { protocol: 'https', hostname: 'www.reportlyfeed.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    reactCompiler: false,
  },
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  },
}

export default withPayload(nextConfig)
