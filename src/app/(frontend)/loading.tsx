import React from 'react'

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-[420px] w-full bg-bg-card rounded-xl shimmer" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-bg-card rounded-lg shimmer" />
        <div className="h-64 bg-bg-card rounded-lg shimmer" />
        <div className="h-64 bg-bg-card rounded-lg shimmer" />
      </div>
    </div>
  )
}
