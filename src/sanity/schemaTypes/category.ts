import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'order', title: 'Order', type: 'number', description: 'Optional navbar sort order. Lower numbers appear first.'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3})
  ]
})
