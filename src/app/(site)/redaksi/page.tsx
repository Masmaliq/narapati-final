import {getRedaksiContent} from '@/lib/redaksiContent'

export const dynamic = 'force-dynamic'

export default async function RedaksiPage() {
  const redaksiPageData = await getRedaksiContent()

  return (
    <>
      <section className="page-hero identity-hero">
        <div className="container">
          <div className="eyebrow">{redaksiPageData.heroLabel}</div>
          <h1>{redaksiPageData.heroTitle}</h1>
          <p>{redaksiPageData.heroDescription}</p>
        </div>
      </section>
      <section className="container identity-page">
        <div className="identity-lead">
          <span>{redaksiPageData.introLabel}</span>
          <h2>{redaksiPageData.introTitle}</h2>
          <p>{redaksiPageData.introDescription}</p>
        </div>

        <div className="section-header">
          <div>
            <div className="eyebrow">{redaksiPageData.mastheadLabel}</div>
            <h2 className="section-title">{redaksiPageData.mastheadTitle}</h2>
          </div>
        </div>

        <div className="identity-card-grid editorial-grid">
          {redaksiPageData.cards.map((card) => (
            <article className="identity-card" key={card.title}>
              <span>{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <div className="identity-note">
          <strong>{redaksiPageData.ethicsTitle}</strong>
          <p>{redaksiPageData.ethicsDescription} {redaksiPageData.ethicsContactText}</p>
        </div>
      </section>
    </>
  )
}
