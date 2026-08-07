'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface WhosAmungUsProps {
  siteKey?: string
  className?: string
}

export const WhosAmungUs: React.FC<WhosAmungUsProps> = ({
  siteKey = process.env.NEXT_PUBLIC_WHOS_AMUNG_US_KEY,
  className = '',
}) => {
  const keyToUse = siteKey || 'reportlyfeed'
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Clean up previous script instance on navigation
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }

    // 1. Create whos.amung.us dynamic configuration script
    const configScript = document.createElement('script')
    configScript.id = `_wau_${keyToUse}`
    configScript.innerHTML = `var _wau = _wau || []; _wau.push(["dynamic", "${keyToUse}", "9c5", "c4302bffffff", "small"]);`

    // 2. Create whos.amung.us execution script
    const execScript = document.createElement('script')
    execScript.async = true
    execScript.src = '//waust.at/d.js'

    if (containerRef.current) {
      containerRef.current.appendChild(configScript)
      containerRef.current.appendChild(execScript)
    }
  }, [pathname, keyToUse])

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center gap-2 min-h-[30px] opacity-90 hover:opacity-100 transition-opacity ${className}`}
    />
  )
}
