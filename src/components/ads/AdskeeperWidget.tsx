'use client'

import React, { useEffect } from 'react'

interface AdskeeperWidgetProps {
  widgetId?: string
  className?: string
  label?: string
}

export const AdskeeperWidget: React.FC<AdskeeperWidgetProps> = ({
  widgetId,
  className = '',
  label = 'Advertisement',
}) => {
  useEffect(() => {
    if (!widgetId) return
    try {
      const script = document.createElement('script')
      script.src = `https://jsc.adskeeper.co/${widgetId}.js`
      script.async = true
      document.head.appendChild(script)
    } catch (e) {
      console.warn('Adskeeper script init exception:', e)
    }
  }, [widgetId])

  if (!widgetId) {
    return (
      <div className={`my-6 rounded-lg border border-dashed border-accent-primary/30 bg-accent-primary/5 p-4 text-center ${className}`}>
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent-primary/60 font-semibold block mb-1">
          {label}
        </span>
        <div className="py-4 text-xs font-mono text-text-muted flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
          <span>Adskeeper Widget Slot ({label})</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`my-6 overflow-hidden rounded-lg bg-bg-surface border border-border p-2 ${className}`}>
      <div id={`M${widgetId}`} />
    </div>
  )
}
