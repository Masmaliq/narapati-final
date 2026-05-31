import {defineArrayMember, defineField, defineType} from 'sanity'

const sectionOptions = [
  {title: 'Hero Article', value: 'hero'},
  {title: 'Journal / Latest Articles', value: 'journal'},
  {title: 'Featured Article', value: 'featured'},
  {title: 'Global Section', value: 'global'},
  {title: 'Insight Section', value: 'insight'},
  {title: 'Market Section', value: 'market'},
  {title: 'Photography Section', value: 'photography'},
  {title: 'Video Section', value: 'video'}
]

const articleReference = defineArrayMember({
  type: 'reference',
  to: [{type: 'article'}]
})

export const homepageSettingsType = defineType({
  name: 'homepageSettings',
  title: 'Homepage Manager',
  type: 'document',
  groups: [
    {name: 'layout', title: 'Layout'},
    {name: 'articles', title: 'Articles'},
    {name: 'media', title: 'Media'}
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      group: 'layout',
      initialValue: 'Narapati Homepage Manager',
      readOnly: true
    }),
    defineField({
      name: 'sectionOrder',
      title: 'Homepage Sections',
      type: 'array',
      group: 'layout',
      description: 'Show, hide, and reorder major homepage sections.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'section',
              title: 'Section',
              type: 'string',
              options: {list: sectionOptions}
            }),
            defineField({
              name: 'visible',
              title: 'Show section',
              type: 'boolean',
              initialValue: true
            })
          ],
          preview: {
            select: {
              section: 'section',
              visible: 'visible'
            },
            prepare({section, visible}) {
              const label = sectionOptions.find((item) => item.value === section)?.title || 'Homepage Section'
              return {
                title: label,
                subtitle: visible === false ? 'Hidden' : 'Visible'
              }
            }
          }
        })
      ],
      initialValue: sectionOptions.map((item) => ({section: item.value, visible: true}))
    }),
    defineField({
      name: 'heroArticle',
      title: 'Hero Article',
      type: 'reference',
      group: 'articles',
      to: [{type: 'article'}],
      description: 'Main cinematic headline article.'
    }),
    defineField({
      name: 'featuredArticle',
      title: 'Featured Article',
      type: 'reference',
      group: 'articles',
      to: [{type: 'article'}],
      description: 'Large editorial feature below Journal.'
    }),
    defineField({
      name: 'journalArticles',
      title: 'Journal Articles',
      type: 'array',
      group: 'articles',
      description: 'Select and reorder cards in the Journal section.',
      of: [articleReference]
    }),
    defineField({
      name: 'globalArticles',
      title: 'Global Section Articles',
      type: 'array',
      group: 'articles',
      description: 'First selected article appears in the Global card.',
      of: [articleReference]
    }),
    defineField({
      name: 'insightArticles',
      title: 'Insight Section Articles',
      type: 'array',
      group: 'articles',
      description: 'First selected article appears in the Insight card.',
      of: [articleReference]
    }),
    defineField({
      name: 'marketArticles',
      title: 'Market Section Articles',
      type: 'array',
      group: 'articles',
      description: 'First selected article appears in the Market card.',
      of: [articleReference]
    }),
    defineField({
      name: 'videoItems',
      title: 'Video Section',
      type: 'array',
      group: 'media',
      description: 'First selected video becomes the lead video. Reorder to control display.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'video'}]
        })
      ]
    }),
    defineField({
      name: 'photographyItems',
      title: 'Photography Section',
      type: 'array',
      group: 'media',
      description: 'Select and reorder Visual Journal photos.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'photography'}]
        })
      ]
    })
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Manager',
        subtitle: 'Editorial layout control'
      }
    }
  }
})
