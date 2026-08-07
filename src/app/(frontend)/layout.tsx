import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import '../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

import Script from 'next/script'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ReportlyFeed — Insightful News & Verified Reports',
  description: 'Independent, data-driven political news, breaking reports, global market analysis, and investigative journalism.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://reportlyfeed.com'),
  openGraph: {
    siteName: 'ReportlyFeed',
    type: 'website',
    locale: 'en_US',
  },
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-primary text-text-primary min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 max-w-container w-full mx-auto px-4 pt-2 pb-6">
          {children}
        </main>
        <Footer />
        {process.env.NEXT_PUBLIC_ADS_KEEPER_SITE_ID && (
          <Script
            src={`https://jsc.adskeeper.com/site/${process.env.NEXT_PUBLIC_ADS_KEEPER_SITE_ID}.js`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
