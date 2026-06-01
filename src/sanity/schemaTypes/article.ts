import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  SeoDescriptionCounter,
  SeoTitleCounter,
  StatusWorkflowInput,
  WritingStatsInput
} from '../components/ArticleEditorAssist'

const editorialImageFields = [
  defineField({
    name: 'caption',
    title: 'Image Caption',
    type: 'text',
    rows: 3,
    description: 'Editorial caption shown below the image on the website.',
    validation: (Rule) => Rule.required().warning('Caption wajib diisi untuk menjaga kualitas editorial visual.')
  }),
  defineField({
    name: 'credit',
    title: 'Photo Credit',
    type: 'string',
    description: 'Example: Foto: Narapati Journal / Malik Ibrahim',
    validation: (Rule) => Rule.required().warning('Photo credit wajib diisi untuk arsip visual Narapati.')
  }),
  defineField({
    name: 'location',
    title: 'Location',
    type: 'string',
    description: 'Example: Karawang'
  }),
  defineField({
    name: 'dateTaken',
    title: 'Date Taken',
    type: 'date'
  }),
  defineField({
    name: 'alt',
    title: 'Alt Text',
    type: 'string',
    description: 'Short accessibility text for screen readers and SEO.',
    validation: (Rule) => Rule.required().warning('Alt text wajib diisi untuk aksesibilitas dan SEO.')
  })
]

export const articleType = defineType({
  name: 'article',
  title: 'Article Editor',
  type: 'document',
  description: 'Tempat merangkai cerita, gagasan, dan refleksi Narapati.',
  groups: [
    {name: 'writing', title: 'Writing Area', default: true},
    {name: 'panel', title: 'Editorial Panel'},
    {name: 'visual', title: 'Featured Image'},
    {name: 'seo', title: 'SEO Panel'},
    {name: 'workflow', title: 'Workflow'}
  ],
  fieldsets: [
    {
      name: 'articleHeader',
      title: 'Article Editor',
      description: 'Tempat merangkai cerita, gagasan, dan refleksi Narapati.',
      options: {collapsible: false}
    },
    {
      name: 'articleSettings',
      title: 'Article Settings',
      options: {collapsible: false, columns: 2}
    },
    {
      name: 'seoPanel',
      title: 'SEO Panel',
      options: {collapsible: false}
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'writing',
      fieldset: 'articleHeader',
      description: 'Tulis judul artikel...',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'dek',
      title: 'Subtitle / Excerpt',
      type: 'text',
      rows: 3,
      group: 'writing',
      fieldset: 'articleHeader',
      description: 'Ringkasan singkat artikel...',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'array',
      group: 'writing',
      description: 'Mulai menulis...',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: editorialImageFields
        })
      ]
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'panel',
      fieldset: 'articleSettings',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'panel',
      fieldset: 'articleSettings',
      to: [{type: 'author'}],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'panel',
      fieldset: 'articleSettings',
      initialValue: 'draft',
      options: {
        layout: 'radio',
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Review', value: 'review'},
          {title: 'Scheduled', value: 'scheduled'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      group: 'panel',
      fieldset: 'articleSettings',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time',
      type: 'number',
      group: 'panel',
      fieldset: 'articleSettings',
      description: 'Optional editorial estimate in minutes. Writing Tools will calculate a live estimate from body text.'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      group: 'panel',
      fieldset: 'articleSettings',
      initialValue: false
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured Image',
      type: 'image',
      options: {hotspot: true},
      group: 'visual',
      description: 'Upload Image / Replace Image. Caption, credit, and alt text are required for editorial images.',
      fields: editorialImageFields,
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'writingStats',
      title: 'Writing Statistics',
      type: 'string',
      group: 'workflow',
      readOnly: true,
      components: {input: WritingStatsInput}
    }),
    defineField({
      name: 'editorialStatus',
      title: 'Editorial Status',
      type: 'string',
      group: 'workflow',
      readOnly: true,
      components: {input: StatusWorkflowInput}
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      fieldset: 'seoPanel',
      description: 'Optional custom title for search engines and social sharing.',
      validation: (Rule) => Rule.max(70).warning('SEO title idealnya di bawah 70 karakter.'),
      components: {input: SeoTitleCounter}
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      fieldset: 'seoPanel',
      description: 'Optional custom meta description. If empty, the excerpt is used.',
      validation: (Rule) => Rule.max(160).warning('SEO description idealnya di bawah 160 karakter.'),
      components: {input: SeoDescriptionCounter}
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'seo',
      fieldset: 'seoPanel',
      options: {source: 'title'},
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'seoImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {hotspot: true},
      group: 'seo',
      fieldset: 'seoPanel',
      fields: editorialImageFields,
      description: 'Optional image for OpenGraph and social sharing.'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      media: 'mainImage'
    }
  }
})
