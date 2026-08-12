'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useForm } from '@payloadcms/ui'

/**
 * Payload 3's client-side SPA transitions and post-save updates can leave the Lexical
 * editor uninitialised on Article forms. This component ensures that any navigation
 * or save action on Article routes performs a clean document refresh.
 */
export const AdminHardRefresh: React.FC = () => {
  const pathname = usePathname()
  const lastPathnameRef = useRef(pathname)

  let isSubmitting = false
  try {
    const form = useForm() as any
    isSubmitting = Boolean(form?.isSubmitting || form?.submitting)
  } catch {
    // Executed outside form context on list views
  }

  const prevSubmittingRef = useRef(isSubmitting)

  // 1. Post-save refresh: Reload page when form submission finishes
  useEffect(() => {
    const wasSubmitting = prevSubmittingRef.current
    prevSubmittingRef.current = isSubmitting

    if (wasSubmitting && !isSubmitting) {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin/collections/articles')) {
        setTimeout(() => {
          window.location.reload()
        }, 200)
      }
    }
  }, [isSubmitting])

  // 2. SPA route navigation: Hard-navigate if Next.js router changes pathname into articles
  useEffect(() => {
    if (
      pathname &&
      pathname !== lastPathnameRef.current &&
      pathname.startsWith('/admin/collections/articles')
    ) {
      lastPathnameRef.current = pathname
      if (typeof window !== 'undefined') {
        window.location.assign(window.location.href)
      }
    } else {
      lastPathnameRef.current = pathname
    }
  }, [pathname])

  // 3. Link click interceptor
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a')
      const href = anchor?.getAttribute('href')

      if (!anchor || !href || !href.startsWith('/admin/collections/articles')) return
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const dest = new URL(href, window.location.origin)
      if (dest.href === window.location.href) return

      event.preventDefault()
      event.stopPropagation()
      window.location.assign(dest.href)
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => document.removeEventListener('click', handleDocumentClick, true)
  }, [])

  return null
}

export default AdminHardRefresh
