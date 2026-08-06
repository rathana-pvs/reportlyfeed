import type { Block } from 'payload'

export const VideoEmbed: Block = {
  slug: 'videoEmbed',
  labels: {
    singular: 'Video Embed',
    plural: 'Video Embeds',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'YouTube or Vimeo Video URL',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption / Source (Optional)',
    },
  ],
}
