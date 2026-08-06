import React from 'react'
import Image from 'next/image'
import { Author } from '@/types'
import { getImageUrl } from '@/lib/utils'

interface AuthorChipProps {
  author?: Author | string | null
}

export const AuthorChip: React.FC<AuthorChipProps> = ({ author }) => {
  if (!author) return null

  const name = typeof author === 'string' ? author : author.name
  const avatarUrl = typeof author !== 'string' && author.avatar ? getImageUrl(author.avatar) : null
  const role = typeof author !== 'string' ? author.role : null

  return (
    <div className="flex items-center gap-2 text-xs font-sans text-text-secondary">
      {avatarUrl ? (
        <div className="w-5 h-5 rounded-full overflow-hidden relative border border-border">
          <Image src={avatarUrl} alt={name} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-accent-primary text-white font-bold text-[10px] flex items-center justify-center">
          {name.charAt(0)}
        </div>
      )}
      <span className="font-bold text-text-primary">{name}</span>
      {role && <span className="text-text-muted hidden sm:inline">• {role}</span>}
    </div>
  )
}
