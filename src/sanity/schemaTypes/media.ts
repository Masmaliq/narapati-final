import {defineField, defineType} from 'sanity'

function mediaFields() {
  return [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'dek', title: 'Dek', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
    defineField({name: 'publishedAt', title: 'Published at', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'duration', title: 'Duration', type: 'string'}),
    defineField({name: 'coverImage', title: 'Cover image', type: 'image', options: {hotspot: true}, validation: (Rule) => Rule.required()})
  ]
}

export const podcastType = defineType({
  name: 'podcast',
  title: 'Podcast',
  type: 'document',
  fields: mediaFields()
})

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    ...mediaFields(),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Optional YouTube link for embedded playback.'
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Optional direct MP4/WebM video URL for HTML5 playback.'
    })
  ]
})

const photographyImageFields = [
  defineField({name: 'caption', title: 'Editorial Caption', type: 'text', rows: 3}),
  defineField({name: 'credit', title: 'Photo Credit', type: 'string'}),
  defineField({name: 'location', title: 'Location', type: 'string'}),
  defineField({name: 'dateTaken', title: 'Date Taken', type: 'date'}),
  defineField({name: 'altText', title: 'Alt Text', type: 'string'})
]

export const photographyType = defineType({
  name: 'photography',
  title: 'Photography Desk',
  type: 'document',
  description: 'Kelola arsip visual, caption editorial, lokasi, kredit foto, dan cerita di balik gambar Narapati.',
  groups: [
    {name: 'visual', title: 'Visual Archive', default: true},
    {name: 'editorial', title: 'Editorial Metadata'},
    {name: 'workflow', title: 'Workflow'},
    {name: 'seo', title: 'SEO'}
  ],
  fieldsets: [
    {
      name: 'visualStory',
      title: 'Photography Desk',
      description: 'Kelola arsip visual, caption editorial, lokasi, kredit foto, dan cerita di balik gambar Narapati.',
      options: {collapsible: false}
    },
    {
      name: 'imageMetadata',
      title: 'Image Metadata',
      options: {collapsible: false}
    },
    {
      name: 'publishing',
      title: 'Publishing Workflow',
      options: {collapsible: false, columns: 2}
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Photo Title',
      type: 'string',
      group: 'visual',
      fieldset: 'visualStory',
      description: 'Judul visual yang akan tampil di arsip Photography.',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'visual',
      fieldset: 'visualStory',
      description: 'Ringkasan pendek tentang cerita di balik gambar.'
    }),
    defineField({
      name: 'mainImage',
      title: 'Image Upload',
      type: 'image',
      options: {hotspot: true},
      group: 'visual',
      fieldset: 'visualStory',
      fields: photographyImageFields,
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'caption',
      title: 'Editorial Caption',
      type: 'text',
      rows: 3,
      group: 'editorial',
      fieldset: 'imageMetadata',
      validation: (Rule) => Rule.required().warning('Caption editorial membantu foto terasa sebagai bagian dari narasi.')
    }),
    defineField({
      name: 'credit',
      title: 'Photo Credit',
      type: 'string',
      group: 'editorial',
      fieldset: 'imageMetadata',
      description: 'Example: Narapati Journal / Imam Arifin',
      validation: (Rule) => Rule.required().warning('Kredit foto penting untuk arsip visual Narapati.')
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'editorial',
      fieldset: 'imageMetadata'
    }),
    defineField({
      name: 'dateTaken',
      title: 'Date Taken',
      type: 'date',
      group: 'editorial',
      fieldset: 'imageMetadata'
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      group: 'editorial',
      fieldset: 'imageMetadata',
      description: 'Short accessibility text for screen readers and SEO.',
      validation: (Rule) => Rule.required().warning('Alt text membantu aksesibilitas dan pencarian.')
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'visual',
      of: [{type: 'image', options: {hotspot: true}, fields: photographyImageFields}]
    }),
    defineField({
      name: 'visualCategory',
      title: 'Visual Category',
      type: 'string',
      group: 'editorial',
      options: {
        layout: 'radio',
        list: [
          {title: 'Travel', value: 'Travel'},
          {title: 'Human', value: 'Human'},
          {title: 'Culture', value: 'Culture'},
          {title: 'Spiritual', value: 'Spiritual'},
          {title: 'Landscape', value: 'Landscape'},
          {title: 'Journal', value: 'Journal'}
        ]
      }
    }),
    defineField({
      name: 'photographer',
      title: 'Photographer / Author',
      type: 'reference',
      group: 'editorial',
      to: [{type: 'author'}]
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'workflow',
      fieldset: 'publishing',
      to: [{type: 'category'}]
    }),
    defineField({
      name: 'status',
      title: 'Workflow Status',
      type: 'string',
      group: 'workflow',
      fieldset: 'publishing',
      initialValue: 'draft',
      options: {
        layout: 'radio',
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Review', value: 'review'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'workflow',
      fieldset: 'publishing',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'featured',
      title: 'Featured Photography',
      type: 'boolean',
      group: 'workflow',
      fieldset: 'publishing',
      initialValue: false
    }),
    defineField({
      name: 'watermarkMode',
      title: 'Watermark Mode',
      type: 'string',
      group: 'workflow',
      fieldset: 'publishing',
      initialValue: 'moment',
      options: {
        layout: 'radio',
        list: [
          {title: 'Keep The Moment.', value: 'moment'},
          {title: 'Keep The Story.', value: 'story'},
          {title: 'No Watermark', value: 'none'}
        ]
      }
    }),
    defineField({name: 'body', title: 'Body / Caption', type: 'array', group: 'visual', of: [{type: 'block'}]}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'seo', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(70).warning('SEO title idealnya di bawah 70 karakter.')
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160).warning('SEO description idealnya di bawah 160 karakter.')
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'mainImage'
    }
  }
})
