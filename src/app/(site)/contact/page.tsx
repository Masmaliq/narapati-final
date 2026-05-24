import {TextBlocks} from '@/components/RichText'
import {getSiteSettings} from '@/sanity/lib/fetch'

const contactPageContent = {
  hero: {
    eyebrow: 'Contact',
    title: 'Hubungi NNN',
    description: 'Untuk pertanyaan redaksi, kerja sama, undangan liputan, dan komunikasi bisnis Narapati News Network.'
  },
  lead: {
    label: 'NNN',
    title: 'Ruang komunikasi resmi Narapati.'
  },
  contactItems: [
    {label: 'Email', valueKey: 'contactEmail'},
    {label: 'WhatsApp / Business Inquiry', valueKey: 'whatsapp'},
    {label: 'Address', valueKey: 'address'},
    {label: 'Social Media', valueKey: 'social'}
  ]
} as const

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const contactValues = {
    contactEmail: settings.contactEmail,
    whatsapp: settings.whatsapp,
    address: settings.address,
    social: settings.instagram || settings.linkedin || settings.twitterX
  }

  return (
    <>
      <section className="page-hero identity-hero">
        <div className="container">
          <div className="eyebrow">{contactPageContent.hero.eyebrow}</div>
          <h1>{contactPageContent.hero.title}</h1>
          <p>{contactPageContent.hero.description}</p>
        </div>
      </section>

      <section className="container identity-page">
        <div className="identity-lead">
          <span>{contactPageContent.lead.label}</span>
          <h2>{contactPageContent.lead.title}</h2>
          <TextBlocks text={settings.contactContent} />
        </div>

        <div className="contact-grid">
          {contactPageContent.contactItems.map((item) => (
            <article className="contact-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{contactValues[item.valueKey]}</strong>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
