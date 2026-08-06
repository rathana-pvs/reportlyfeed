'use client'

import React, { useState, useEffect } from 'react'

export const ReadingBar: React.FC = () => {
  const [completion, setCompletion] = useState(0)

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100)
      }
    }

    window.addEventListener('scroll', updateScrollCompletion)
    return () => window.removeEventListener('scroll', updateScrollCompletion)
  }, [])

  return (
    <div className="fixed top-[72px] left-0 w-full h-[3px] bg-transparent z-50">
      <div
        className="h-full bg-accent-primary transition-all duration-150"
        style={{ width: `${completion}%` }}
      />
    </div>
  )
}
