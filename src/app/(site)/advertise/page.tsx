import {TextBlocks} from '@/components/RichText'
import {getSiteSettings} from '@/sanity/lib/fetch'

const advertisePageContent = {
  hero: {
    eyebrow: 'Advertise',
    title: 'Partnership & Brand Collaboration'
  },
  lead: {
    label: 'NNN',
    title: 'Bangun percakapan berkualitas bersama audiens Narapati.'
  },
  cardLabel: 'Partnership',
  businessInquiry: {
    title: 'Business Inquiry',
    prefix: 'Untuk proposal kerja sama, hubungi',
    conjunction: 'atau WhatsApp'
  },
  partnershipItems: [
    {
      title: 'Sponsor',
      description: 'Penempatan sponsor premium pada kanal, liputan khusus, atau program editorial yang relevan.'
    },
    {
      title: 'Advertorial',
      description: 'Konten brand story dan thought leadership dengan standar editorial yang rapi dan kredibel.'
    },
    {
      title: 'Video Partnership',
      description: 'Kolaborasi wawancara, explainer, dokumenter pendek, dan format studio Narapati.'
    },
    {
      title: 'Photography Coverage',
      description: 'Liputan visual, dokumentasi acara, photo story, dan arsip gambar untuk kebutuhan brand.'
    }
  ]
}

export default async function AdvertisePage() {
  const settings = await getSiteSettings()

  return (
    <>
      <section className="page-hero identity-hero">
        <div className="container">
          <div className="eyebrow">{advertisePageContent.hero.eyebrow}</div>
          <h1>{advertisePageContent.hero.title}</h1>
          <p>{settings.advertiseContent}</p>
        </div>
      </section>

      <section className="container identity-page">
        <div className="identity-lead">
          <span>{advertisePageContent.lead.label}</span>
          <h2>{advertisePageContent.lead.title}</h2>
          <TextBlocks text={settings.advertiseContent} />
        </div>

        <div className="identity-card-grid">
          {advertisePageContent.partnershipItems.map((item) => (
            <article className="identity-card" key={item.title}>
              <span>{advertisePageContent.cardLabel}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div className="identity-note">
          <strong>{advertisePageContent.businessInquiry.title}</strong>
          <p>
            {advertisePageContent.businessInquiry.prefix} {settings.contactEmail}{' '}
            {advertisePageContent.businessInquiry.conjunction} {settings.whatsapp}.
          </p>
        </div>
      </section>
    </>
  )
}
