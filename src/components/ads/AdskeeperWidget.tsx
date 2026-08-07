'use client'

import React, { useEffect, useState } from 'react'

interface AdskeeperWidgetProps {
  widgetId?: string
  className?: string
  label?: string
  desktopOnly?: boolean
}

export const AdskeeperWidget: React.FC<AdskeeperWidgetProps> = ({
  widgetId: widgetIdProp,
  className = '',
  label = 'Advertisement',
  desktopOnly = false,
}) => {
  const widgetId = widgetIdProp || '2065377'
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const [mounted, setMounted] = useState<boolean>(false)

  // Use mock ads in local development unless NEXT_PUBLIC_USE_REAL_ADS='true' is set
  const isDev = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_REAL_ADS !== 'true'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!desktopOnly) return
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [desktopOnly])

  // Only load real Adskeeper script in Production mode (or when forced via env)
  useEffect(() => {
    if (!mounted || !widgetId || isDev) return
    // Do not initialize desktop-only widgets until the viewport has been
    // measured and confirmed as desktop-sized.
    if (desktopOnly && isDesktop !== true) return

    try {
      const siteId = process.env.NEXT_PUBLIC_ADS_KEEPER_SITE_ID || '1107405'
      const existingScript = document.querySelector('script[src*="adskeeper.com"]')
      if (!existingScript && siteId) {
        const script = document.createElement('script')
        script.src = `https://jsc.adskeeper.com/site/${siteId}.js`
        script.async = true
        document.head.appendChild(script)
      }

      if (typeof window !== 'undefined') {
        const win = window as any
        win._mgq = win._mgq || []
        win._mgq.push(['_mgc.load'])
      }
    } catch (e) {
      console.warn('Adskeeper script init exception:', e)
    }
  }, [widgetId, desktopOnly, isDesktop, mounted, isDev])

  // Keep desktop-only slots out of the initial render and off mobile devices.
  // This prevents both a visual flash and ad requests before the viewport check.
  if (desktopOnly && isDesktop !== true) {
    return null
  }

  // 1. Render Mock Ad Preview for Local Development
  if (isDev) {
    return (
      <div className={`my-6 w-full ${className}`}>
        <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-primary flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            <span>ADVERTISEMENT (LOCAL DEV MOCK)</span>
          </span>
          <span className="text-[10px] font-mono text-text-muted">
            Slot ID: {widgetId || 'Unset'} • {label}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="sm:col-span-1 aspect-video bg-accent-primary/10 rounded flex flex-col items-center justify-center border border-accent-primary/20 p-2 text-center">
            <span className="text-xs font-mono font-bold text-accent-primary">MOCK AD BANNER</span>
            <span className="text-[10px] font-mono text-text-muted mt-1">Production Live Ad Slot</span>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
              Ad Placement • Real ads load on production deployment
            </span>
            <h4 className="text-sm font-bold text-text-primary leading-tight">
              Sample Monetization Placement — {label}
            </h4>
            <p className="text-xs text-text-secondary line-clamp-2">
              In production builds, Adskeeper script will automatically populate this widget zone ({widgetId || 'ID'}).
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 2. Fallback when widgetId is missing in production
  if (!widgetId) {
    return null
  }

  // 3. Render Real Production Adskeeper Widget Slot
  return (
    <div className={`my-6 overflow-hidden w-full ${className}`} suppressHydrationWarning>
      <div data-type="_mgwidget" data-widget-id={widgetId} id={`M${widgetId}`} suppressHydrationWarning />
    </div>
  )
}

