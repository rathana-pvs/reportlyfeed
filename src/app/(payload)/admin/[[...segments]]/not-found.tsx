import type { Metadata } from 'next'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
import configPromise from '../../../../../payload.config'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config: configPromise, params, searchParams })

export default async function NotFound({ params, searchParams }: Args) {
  return NotFoundPage({ config: configPromise, params, searchParams, importMap: {} })
}
