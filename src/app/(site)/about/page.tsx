import {TextBlocks} from '@/components/RichText'
import {getSiteSettings} from '@/sanity/lib/fetch'

const aboutPageContent = {
  eyebrow: 'Tentang Narapati Journal',
  editorialStatement: 'Journal of a Modern Wanderer',
  editorialSubtitle: 'Tentang dunia, manusia, dan perjalanan memahami kehidupan.',
  leadLabel: 'Narapati Journal',
  cards: [
    {
      title: 'Business',
      description: 'Peliputan ekonomi, perusahaan, pasar, investasi, dan strategi pertumbuhan Indonesia.'
    },
    {
      title: 'Leadership',
      description: 'Wawancara, profil, dan analisis tentang pemimpin, institusi, serta pengambilan keputusan.'
    },
    {
      title: 'Nilai Hidup',
      description: 'Ruang editorial untuk prinsip, karakter, budaya kerja, dan arah hidup yang membangun.'
    },
    {
      title: 'Video & Photography',
      description: 'Format visual premium untuk dokumentasi, wawancara, liputan lapangan, dan cerita manusia.'
    }
  ]
}

export default async function AboutPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <section className="page-hero identity-hero about-hero">
        <div className="container">
          <div className="eyebrow">{aboutPageContent.eyebrow}</div>
          <h1>{settings.siteTitle}</h1>
          <p className="about-editorial-statement">{aboutPageContent.editorialStatement}</p>
          <p className="about-editorial-subtitle">{aboutPageContent.editorialSubtitle}</p>
        </div>
      </section>
      <section className="container identity-page">
        <div className="identity-lead">
          <span>{aboutPageContent.leadLabel}</span>
          <h2>{settings.tagline}</h2>
          <TextBlocks text={settings.aboutContent} />
        </div>

        <div className="identity-card-grid">
          {aboutPageContent.cards.map((card) => (
            <article className="identity-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
