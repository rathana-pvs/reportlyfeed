import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h1 className="text-6xl font-black text-accent-primary font-mono tracking-widest">
        404
      </h1>
      <h2 className="text-2xl font-extrabold text-text-primary">
        Page Not Found
      </h2>
      <p className="text-text-secondary text-sm max-w-md">
        The story or resource you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-accent-primary hover:bg-accent-primary-hover text-white rounded text-xs font-mono font-bold transition-colors shadow-sm"
      >
        Return to Home
      </Link>
    </div>
  )
}
