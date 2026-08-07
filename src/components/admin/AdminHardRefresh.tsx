'use client'

import { useEffect } from 'react'

export const AdminHardRefresh: React.FC = () => {
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      // Target article collection links and article view/create/edit links
      if (
        href.includes('/admin/collections/articles/') ||
        href === '/admin/collections/articles'
      ) {
        const currentPath = window.location.pathname
        if (href !== currentPath) {
          e.preventDefault()
          e.stopPropagation()
          window.location.href = href
        }
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [])

  return null
}

export default AdminHardRefresh
