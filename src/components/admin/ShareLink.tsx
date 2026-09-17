'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

export const ShareLink: React.FC = () => {
  const { id } = useDocumentInfo()
  const slugValue = useFormFields(([fields]: any) => fields?.slug?.value)
  
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  // Tracking links state
  const [links, setLinks] = useState<any[]>([])
  const [label, setLabel] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingLinks, setLoadingLinks] = useState(true)
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)

  // Payload keeps custom UI fields mounted across SPA document navigation.
  // Reset state that belongs to the previous article before loading the next.
  useEffect(() => {
    setCopied(false)
    setShareUrl('')
    setLinks([])
    setLabel('')
    setIsGenerating(false)
    setLoadingLinks(Boolean(id))
    setCopiedLinkId(null)
  }, [id])

  useEffect(() => {
    if (typeof window !== 'undefined' && slugValue) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      setShareUrl(`${siteUrl}/article/${slugValue}`)
    } else {
      setShareUrl('')
    }
  }, [slugValue])

  const fetchLinks = useCallback(async () => {
    if (!id) return
    try {
      setLoadingLinks(true)
      const response = await fetch(`/api/share-links?where[article][equals]=${id}&limit=100&depth=0`)
      if (response.ok) {
        const data = await response.json()
        setLinks(data?.docs || [])
      }
    } catch (error) {
      console.error('Failed to fetch share links:', error)
    } finally {
      setLoadingLinks(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchLinks()
    }
  }, [id, fetchLinks])

  const handleGenerate = async (e?: any) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!id || isGenerating) return

    try {
      setIsGenerating(true)
      const response = await fetch('/api/share-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article: id,
          label: label.trim() || undefined,
        }),
      })

      if (response.ok) {
        setLabel('')
        await fetchLinks()
      } else {
        alert('Failed to generate link')
      }
    } catch (error) {
      console.error('Error generating link:', error)
      alert('An error occurred while generating the link')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this share link?')) return

    try {
      const response = await fetch(`/api/share-links/${linkId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchLinks()
      } else {
        alert('Failed to delete link')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  const handleCopyLink = async (url: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedLinkId(linkId)
      setTimeout(() => setCopiedLinkId(null), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const getFullUrl = (key: string) => {
    if (typeof window !== 'undefined') {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      return `${siteUrl}/article/${key}/${slugValue || ''}`
    }
    return `/article/${key}/${slugValue || ''}`
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  try {
    if (!id) {
      return (
        <>
          <div style={{
            padding: '16px',
            border: '1px solid var(--theme-border-color, #30363d)',
            borderRadius: '4px',
            backgroundColor: 'var(--theme-elevation-50, #161b22)',
            marginBottom: '20px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '12px',
            color: 'var(--theme-text-muted, #8b949e)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--theme-text-color, #f5f0e8)' }}>
              Shareable Links
            </div>
            <p style={{ margin: 0 }}>Save the article to generate shareable links.</p>
          </div>
        </>
      )
    }

    return (
      <>
        <div style={{
          padding: '16px',
          border: '1px solid var(--theme-border-color, #30363d)',
          borderRadius: '4px',
          backgroundColor: 'var(--theme-elevation-50, #161b22)',
          marginBottom: '20px',
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: '12px'
        }}>
          {/* Canonical Link section */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--theme-text-color, #f5f0e8)', fontFamily: 'var(--font-mono, monospace)' }}>
              Canonical Link
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                readOnly
                value={shareUrl || 'Generating...'}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid var(--theme-border-color, #30363d)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--theme-input-bg, #0d1117)',
                  color: 'var(--theme-text-color, #f5f0e8)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono, monospace)',
                  textOverflow: 'ellipsis'
                }}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  border: '1px solid var(--theme-border-color, #30363d)',
                  borderRadius: '4px',
                  backgroundColor: copied ? '#2ecc71' : 'var(--theme-elevation-150, #21262d)',
                  color: copied ? '#ffffff' : 'var(--theme-text-color, #f5f0e8)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.2s ease',
                  fontSize: '11px',
                  borderStyle: 'solid'
                }}
              >
                {copied ? 'Copied!' : 'Copy Canonical'}
              </button>
              {shareUrl && (
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    border: '1px solid var(--theme-border-color, #30363d)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--theme-elevation-150, #21262d)',
                    color: 'var(--theme-text-color, #f5f0e8)',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'inline-block',
                    fontSize: '11px'
                  }}
                >
                  View Article
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Share Links Section */}
          <div style={{ borderTop: '1px solid var(--theme-border-color, #30363d)', paddingTop: '16px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--theme-text-color, #f5f0e8)', fontFamily: 'var(--font-mono, monospace)' }}>
              Anti-Spam / Tracking Links
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Label (e.g. FB Group Comment)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.stopPropagation()
                    void handleGenerate()
                  }
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid var(--theme-border-color, #30363d)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--theme-input-bg, #0d1117)',
                  color: 'var(--theme-text-color, #f5f0e8)',
                  fontSize: '11px',
                }}
              />
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#2ecc71',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '11px',
                  opacity: isGenerating ? 0.6 : 1,
                }}
              >
                {isGenerating ? '...' : 'Create'}
              </button>
            </div>

            {loadingLinks ? (
              <div style={{ color: 'var(--theme-text-muted, #8b949e)', fontSize: '11px', textAlign: 'center', padding: '10px 0' }}>
                Loading links...
              </div>
            ) : links.length === 0 ? (
              <div style={{ color: 'var(--theme-text-muted, #8b949e)', fontSize: '11px', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
                No tracking links generated yet.
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '260px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                {links.map((link: any, index: number) => {
                  const fullUrl = getFullUrl(link?.key || '')
                  const isCopied = copiedLinkId === link?.id
                  return (
                    <div key={link?.id || index} style={{
                      padding: '10px',
                      border: '1px solid var(--theme-border-color, #30363d)',
                      borderRadius: '4px',
                      backgroundColor: 'var(--theme-elevation-100, #1c2128)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '11px' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--theme-text-color, #f5f0e8)' }}>
                          {link?.label || 'Unnamed Link'}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--theme-elevation-150, #21262d)',
                          color: 'var(--theme-text-color, #f5f0e8)',
                          fontWeight: 'bold',
                          fontSize: '10px'
                        }}>
                          {link?.clicks || 0} clicks
                        </span>
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={fullUrl}
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid var(--theme-border-color, #30363d)',
                          borderRadius: '4px',
                          backgroundColor: 'var(--theme-input-bg, #0d1117)',
                          color: 'var(--theme-text-color, #f5f0e8)',
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono, monospace)',
                          textOverflow: 'ellipsis',
                          marginBottom: '8px'
                        }}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(fullUrl, link?.id || '')}
                          style={{
                            flex: 1,
                            padding: '6px',
                            border: '1px solid var(--theme-border-color, #30363d)',
                            borderRadius: '4px',
                            backgroundColor: isCopied ? '#2ecc71' : 'var(--theme-elevation-150, #21262d)',
                            color: isCopied ? '#ffffff' : 'var(--theme-text-color, #f5f0e8)',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(link?.id || '')}
                          style={{
                            padding: '6px 10px',
                            border: '1px solid #e74c3c',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            color: '#e74c3c',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '10px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </>
    )
  } catch (err: any) {
    console.error("ShareLink render error:", err)
    return (
      <div style={{
        padding: '16px',
        border: '1px solid #e74c3c',
        borderRadius: '4px',
        backgroundColor: '#fdf2f2',
        color: '#e74c3c',
        fontSize: '12px',
        fontFamily: 'monospace',
        marginBottom: '20px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          ShareLink Error:
        </div>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{err?.stack || err?.message || String(err)}</pre>
      </div>
    )
  }
}
