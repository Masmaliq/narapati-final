import {MenuIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const linkTypeOptions = [
  {title: 'Category', value: 'category'},
  {title: 'Internal Page', value: 'internal'},
  {title: 'External Link', value: 'external'}
]

export const navigationSettingsType = defineType({
  name: 'navigationSettings',
  title: 'Navbar Settings',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Navbar Settings',
      readOnly: true
    }),
    defineField({
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      description: 'Add, hide, and reorder the public Narapati navigation menu.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Example: Insight, Market, Video, Photography',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'mobileLabel',
              title: 'Mobile Label',
              type: 'string',
              description: 'Optional shorter label for mobile navigation.'
            }),
            defineField({
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              options: {
                list: linkTypeOptions,
                layout: 'radio'
              },
              initialValue: 'category',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'categoryReference',
              title: 'Category Reference',
              type: 'reference',
              to: [{type: 'category'}],
              hidden: ({parent}) => parent?.linkType !== 'category',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {linkType?: string} | undefined
                  if (parent?.linkType === 'category' && !value) return 'Choose a category for this navigation item.'
                  return true
                })
            }),
            defineField({
              name: 'internalPath',
              title: 'Internal Path',
              type: 'string',
              description: 'Examples: /video, /photography, /about',
              hidden: ({parent}) => parent?.linkType !== 'internal',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {linkType?: string} | undefined
                  if (parent?.linkType !== 'internal') return true
                  if (!value) return 'Enter an internal path.'
                  return value.startsWith('/') ? true : 'Internal paths must start with /.'
                })
            }),
            defineField({
              name: 'externalUrl',
              title: 'External URL',
              type: 'url',
              hidden: ({parent}) => parent?.linkType !== 'external',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {linkType?: string} | undefined
                  if (parent?.linkType === 'external' && !value) return 'Enter an external URL.'
                  return true
                })
            }),
            defineField({
              name: 'visible',
              title: 'Visible',
              type: 'boolean',
              initialValue: true
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: false
            }),
            defineField({
              name: 'highlight',
              title: 'Highlight',
              type: 'boolean',
              description: 'Optional featured navigation treatment.',
              initialValue: false
            })
          ],
          preview: {
            select: {
              label: 'label',
              linkType: 'linkType',
              visible: 'visible',
              highlight: 'highlight',
              category: 'categoryReference.title',
              internalPath: 'internalPath',
              externalUrl: 'externalUrl'
            },
            prepare({label, linkType, visible, highlight, category, internalPath, externalUrl}) {
              const target = linkType === 'category' ? category : linkType === 'internal' ? internalPath : externalUrl
              return {
                title: label || 'Navigation Item',
                subtitle: `${visible === false ? 'Hidden' : 'Visible'}${highlight ? ' • Highlight' : ''} • ${linkType || 'category'}${target ? ` • ${target}` : ''}`
              }
            }
          }
        })
      ],
      initialValue: [
        {label: 'Insight', linkType: 'category', visible: true, openInNewTab: false, highlight: false},
        {label: 'Market', linkType: 'category', visible: true, openInNewTab: false, highlight: false},
        {label: 'Video', linkType: 'internal', internalPath: '/video', visible: true, openInNewTab: false, highlight: false},
        {label: 'Photography', linkType: 'internal', internalPath: '/photography', visible: true, openInNewTab: false, highlight: false}
      ]
    })
  ],
  preview: {
    prepare() {
      return {
        title: 'Navbar Settings',
        subtitle: 'Public navbar manager'
      }
    }
  }
})
