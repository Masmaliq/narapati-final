import {defineArrayMember, defineField, defineType} from 'sanity'

const editorialImageFields = [
  defineField({
    name: 'alt',
    title: 'Alt Text',
    type: 'string'
  }),
  defineField({
    name: 'caption',
    title: 'Image Caption',
    type: 'text',
    rows: 3
  }),
  defineField({
    name: 'credit',
    title: 'Photo Credit',
    type: 'string',
    description: 'Example: Foto: Narapati Network / Malik Ibrahim'
  })
]

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'dek', title: 'Dek', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({name: 'publishedAt', title: 'Published at', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {hotspot: true},
      fields: editorialImageFields,
      validation: (Rule) => Rule.required()
    }),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'author', title: 'Author', type: 'reference', to: [{type: 'author'}], validation: (Rule) => Rule.required()}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: editorialImageFields
        })
      ]
    })
  ]
})
