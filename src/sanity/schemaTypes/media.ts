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

export const photographyType = defineType({
  name: 'photography',
  title: 'Photography',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'mainImage', title: 'Main image', type: 'image', options: {hotspot: true}, validation: (Rule) => Rule.required()}),
    defineField({name: 'gallery', title: 'Gallery', type: 'array', of: [{type: 'image', options: {hotspot: true}}]}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'photographer', title: 'Photographer / Author', type: 'reference', to: [{type: 'author'}]}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}]}),
    defineField({name: 'publishedAt', title: 'Published at', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({name: 'body', title: 'Body / Caption', type: 'array', of: [{type: 'block'}]})
  ]
})
