import {defineField, defineType} from 'sanity'

const textField = (name: string, title: string, rows = 4) =>
  defineField({
    name,
    title,
    type: 'text',
    rows
  })

const urlField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'url'
  })

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({name: 'siteTitle', title: 'Site title', type: 'string'}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    textField('description', 'Description'),
    textField('address', 'Address', 3),
    defineField({name: 'contactEmail', title: 'Contact email', type: 'email'}),
    defineField({name: 'whatsapp', title: 'WhatsApp', type: 'string'}),
    urlField('instagram', 'Instagram'),
    urlField('youtube', 'YouTube'),
    urlField('tiktok', 'TikTok'),
    urlField('linkedin', 'LinkedIn'),
    urlField('twitterX', 'Twitter / X'),
    textField('privacyText', 'Privacy text', 8),
    textField('kodeEtikText', 'Kode etik text', 8),
    defineField({name: 'footerCopyright', title: 'Footer copyright', type: 'string'}),
    textField('aboutContent', 'About content', 10),
    textField('redaksiContent', 'Redaksi content', 10),
    textField('contactContent', 'Contact content', 8),
    textField('advertiseContent', 'Advertise content', 8)
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global Narapati Journal settings'
      }
    }
  }
})
