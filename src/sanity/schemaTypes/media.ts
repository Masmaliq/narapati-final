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
  fields: mediaFields()
})
