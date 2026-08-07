'use client'

import React from 'react'

interface WhosAmungUsProps {
  siteKey?: string
  className?: string
}

export const WhosAmungUs: React.FC<WhosAmungUsProps> = ({
  siteKey = process.env.NEXT_PUBLIC_WHOS_AMUNG_US_KEY,
  className = '',
}) => {
  const keyToUse = siteKey || 'reportlyfeed'

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <a
        href={`https://whos.amung.us/stats/${keyToUse}/`}
        target="_blank"
        rel="noopener noreferrer"
        title="View live reader stats on whos.amung.us"
        className="opacity-90 hover:opacity-100 transition-opacity flex items-center"
      >
        <img
          src={`https://whos.amung.us/swidget/${keyToUse}.png`}
          alt="whos.amung.us live stats"
          width={81}
          height={29}
          className="border-0 rounded shadow-sm"
        />
      </a>
    </div>
  )
}
