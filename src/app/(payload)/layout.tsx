import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'
import configPromise from '../../../payload.config'
import { importMap } from './admin/importMap.js'
import '@payloadcms/next/css'

// Filter Payload 3.x getFromImportMap dev mode warning
if (typeof window === 'undefined') {
  const originalConsoleError = console.error
  console.error = (...args: any[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : (args[0]?.message || '')
    if (msg.includes('getFromImportMap') || JSON.stringify(args).includes('getFromImportMap')) {
      return
    }
    originalConsoleError(...args)
  }
}

type Args = {
  children: React.ReactNode
}

const serverFunction = async function (args: any) {
  'use server'
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}

export default function Layout({ children }: Args) {
  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
