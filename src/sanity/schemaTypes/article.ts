import {defineArrayMember, defineField, defineType} from 'sanity'

const editorialImageFields = [
  defineField({
    name: 'caption',
    title: 'Image Caption',
    type: 'text',
    rows: 3,
    description: 'Editorial caption shown below the image on the website.'
  }),
  defineField({
    name: 'credit',
    title: 'Photo Credit',
    type: 'string',
    description: 'Example: Foto: Narapati Network / Malik Ibrahim'
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
    description: 'Short accessibility text for screen readers and SEO.'
  })
]

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    {name: 'editorial', title: 'Editorial'},
    {name: 'visual', title: 'Visual'},
    {name: 'body', title: 'Body'},
    {name: 'seo', title: 'SEO'}
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'editorial', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'editorial', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'category', title: 'Category', type: 'reference', group: 'editorial', to: [{type: 'category'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'author', title: 'Author', type: 'reference', group: 'editorial', to: [{type: 'author'}], validation: (Rule) => Rule.required()}),
    defineField({
      name: 'dek',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'editorial',
      description: 'Short editorial summary displayed on cards and article pages.',
      validation: (Rule) => Rule.required()
    }),
    defineField({name: 'publishedAt', title: 'Published at', type: 'datetime', group: 'editorial', validation: (Rule) => Rule.required()}),
    defineField({name: 'featured', title: 'Featured / Top Story', type: 'boolean', group: 'editorial', initialValue: false}),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {hotspot: true},
      group: 'visual',
      fields: editorialImageFields,
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'body',
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
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Optional custom title for search engines and social sharing.'
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Optional custom meta description. If empty, the excerpt is used.'
    }),
    defineField({
      name: 'seoImage',
      title: 'SEO / Social Image',
      type: 'image',
      options: {hotspot: true},
      group: 'seo',
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
