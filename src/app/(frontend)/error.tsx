'use client'

import React, { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Router Error:', error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center font-mono font-bold text-xl">
        !
      </div>
      <h2 className="text-2xl font-extrabold text-text-primary">
        Something went wrong
      </h2>
      <p className="text-text-secondary text-sm max-w-md">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-accent-primary hover:bg-accent-primary-hover text-white rounded text-xs font-mono font-bold transition-colors shadow-sm"
      >
        Try Again
      </button>
    </div>
  )
}
