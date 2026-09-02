import type { Block } from 'payload'

export const TwitterEmbed: Block = {
  slug: 'twitterEmbed',
  labels: {
    singular: 'Twitter / X Embed',
    plural: 'Twitter / X Embeds',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'Tweet / Post URL',
      required: true,
    },
    {
      name: 'tweetText',
      type: 'textarea',
      label: 'Post Content (Optional)',
    },
    {
      name: 'author',
      type: 'text',
      label: 'Author Name (Optional)',
    },
    {
      name: 'authorHandle',
      type: 'text',
      label: 'Author Handle (Optional, e.g. @username)',
    },
    {
      name: 'date',
      type: 'text',
      label: 'Date (Optional)',
    },
  ],
}
