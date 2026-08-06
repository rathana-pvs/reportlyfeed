'use client'

import React from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-3xl font-bold text-red-500">System Error</h1>
          <p className="text-slate-300 text-sm">
            A global application error occurred.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-mono font-bold transition-colors"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  )
}
