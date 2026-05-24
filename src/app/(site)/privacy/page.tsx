import {TextBlocks} from '@/components/RichText'
import {getSiteSettings} from '@/sanity/lib/fetch'

const privacyPageContent = {
  hero: {
    eyebrow: 'Privacy',
    title: 'Privacy Policy'
  },
  sections: {
    privacyTitle: 'Kebijakan Privasi',
    contactTitle: 'Kontak',
    contactPrefix: 'Pertanyaan privasi dapat dikirim ke'
  }
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <section className="page-hero identity-hero">
        <div className="container">
          <div className="eyebrow">{privacyPageContent.hero.eyebrow}</div>
          <h1>{privacyPageContent.hero.title}</h1>
          <p>{settings.privacyText}</p>
        </div>
      </section>
      <section className="container text-page">
        <h2>{privacyPageContent.sections.privacyTitle}</h2>
        <TextBlocks text={settings.privacyText} />
        <h2>{privacyPageContent.sections.contactTitle}</h2>
        <p>{privacyPageContent.sections.contactPrefix} {settings.contactEmail}.</p>
      </section>
    </>
  )
}
