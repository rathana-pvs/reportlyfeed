'use client'

import { useEffect } from 'react'

/**
 * Payload's client-side route transition can leave custom UI fields and the
 * Lexical editor uninitialised on a new Article form. Loading Article routes
 * as a document navigation gives each form a fresh Payload form context.
 */
export const AdminHardRefresh: React.FC = () => {
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a')
      const href = anchor?.getAttribute('href')

      if (!anchor || !href || !href.startsWith('/admin/collections/articles')) return
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const destination = new URL(href, window.location.origin)
      const current = new URL(window.location.href)

      if (destination.href === current.href) return

      event.preventDefault()
      event.stopPropagation()
      window.location.assign(destination.href)
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => document.removeEventListener('click', handleDocumentClick, true)
  }, [])

  return null
}

export default AdminHardRefresh
