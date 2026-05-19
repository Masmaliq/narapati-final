const editors = [
  ['Anindya Prameswari', 'Editor in Chief'],
  ['Rafi Wiratama', 'Global Affairs Editor'],
  ['Mahesa Kartiko', 'Business Editor'],
  ['Dara Santoso', 'Culture Editor']
]

export default function RedaksiPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Redaksi</div>
          <h1>Editorial Desk</h1>
          <p>The Narapati newsroom is organized for rigorous reporting, clear accountability, and careful editorial review.</p>
        </div>
      </section>
      <section className="container text-page">
        <h2>Masthead</h2>
        <div className="grid-2">
          {editors.map(([name, role]) => (
            <article className="brief-card" key={name}>
              <h3>{name}</h3>
              <p>{role}</p>
            </article>
          ))}
        </div>
        <h2>Contact</h2>
        <p>Editorial inquiries, corrections, and partnership notes can be directed to redaksi@narapati.news.</p>
      </section>
    </>
  )
}
