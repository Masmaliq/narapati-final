const redaksiPageData = {
  hero: {
    label: 'Redaksi',
    title: 'Tim Editorial',
    description: 'Ruang redaksi Narapati News Network disusun untuk menjaga akurasi, akuntabilitas, dan standar editorial yang tenang, tajam, serta bertanggung jawab.'
  },
  lead: {
    label: 'Editorial',
    title: 'Suara Pemimpin, Perspektif Nusantara.',
    description: 'Tim editorial NNN bekerja melalui desk yang fokus pada bisnis, kepemimpinan, analisis, video, dan photography. Setiap karya dirancang untuk memberi konteks yang jernih bagi pembaca modern Indonesia.'
  },
  masthead: {
    label: 'Masthead',
    title: 'Struktur Redaksi'
  },
  ethicsNote: {
    title: 'Kode Etik & Kontak Redaksi',
    description: 'NNN menjunjung prinsip akurasi, independensi, keberimbangan, dan tanggung jawab publik dalam setiap penerbitan.',
    contactText: 'Koreksi, hak jawab, dan catatan editorial dapat dikirim ke redaksi@narapati.news.'
  },
  mastheadCards: [
    {
      label: 'Redaksi',
      title: 'Pemimpin Redaksi',
      description: 'Bertanggung jawab atas arah editorial, standar publikasi, dan integritas ruang redaksi.'
    },
    {
      label: 'Operasional',
      title: 'Redaktur Pelaksana',
      description: 'Mengelola agenda harian, koordinasi desk, alur penyuntingan, dan prioritas penerbitan.'
    },
    {
      label: 'Analisis',
      title: 'Tim Analisis',
      description: 'Menyusun konteks, riset, dan pembacaan mendalam untuk isu bisnis, ekonomi, dan kepemimpinan.'
    },
    {
      label: 'Visual',
      title: 'Tim Video',
      description: 'Mengembangkan wawancara, laporan visual, dan format video editorial Narapati.'
    },
    {
      label: 'Dokumentasi',
      title: 'Tim Photography',
      description: 'Mengerjakan dokumentasi visual, photo story, liputan ruang, dan arsip gambar editorial.'
    }
  ]
}

export default function RedaksiPage() {
  return (
    <>
      <section className="page-hero identity-hero">
        <div className="container">
          <div className="eyebrow">{redaksiPageData.hero.label}</div>
          <h1>{redaksiPageData.hero.title}</h1>
          <p>{redaksiPageData.hero.description}</p>
        </div>
      </section>
      <section className="container identity-page">
        <div className="identity-lead">
          <span>{redaksiPageData.lead.label}</span>
          <h2>{redaksiPageData.lead.title}</h2>
          <p>{redaksiPageData.lead.description}</p>
        </div>

        <div className="section-header">
          <div>
            <div className="eyebrow">{redaksiPageData.masthead.label}</div>
            <h2 className="section-title">{redaksiPageData.masthead.title}</h2>
          </div>
        </div>

        <div className="identity-card-grid editorial-grid">
          {redaksiPageData.mastheadCards.map((card) => (
            <article className="identity-card" key={card.title}>
              <span>{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <div className="identity-note">
          <strong>{redaksiPageData.ethicsNote.title}</strong>
          <p>{redaksiPageData.ethicsNote.description} {redaksiPageData.ethicsNote.contactText}</p>
        </div>
      </section>
    </>
  )
}
