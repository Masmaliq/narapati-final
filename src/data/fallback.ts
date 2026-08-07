import type {Article, Category, MediaItem, NavigationItem, SiteSettings} from '@/types/content'

export const categories: Category[] = [
  {title: 'Nasional', slug: 'nasional', description: 'Power, policy, and civic life across Indonesia.'},
  {title: 'Global', slug: 'global', description: 'Diplomacy, markets, security, and world affairs.'},
  {title: 'Business', slug: 'business', description: 'Capital, companies, and the people shaping growth.'},
  {title: 'Culture', slug: 'culture', description: 'Ideas, arts, identity, and contemporary life.'}
]

export const navigationItems: NavigationItem[] = [
  {label: 'Insight', type: 'category', href: '/category/insight', visible: true, openInNewTab: false},
  {label: 'Market', type: 'category', href: '/category/market', visible: true, openInNewTab: false},
  {label: 'Video', type: 'internal', href: '/video', visible: true, openInNewTab: false},
  {label: 'Photography', type: 'internal', href: '/photography', visible: true, openInNewTab: false}
]

export const articles: Article[] = [
  {
    title: 'Indonesia Charts a New Maritime Industrial Corridor',
    slug: 'indonesia-maritime-industrial-corridor',
    dek: 'A strategic look at ports, clean logistics, and the regional capital flowing toward the archipelago.',
    category: categories[0],
    publishedAt: '2026-05-18',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
    author: {name: 'Anindya Prameswari', role: 'Senior Correspondent'},
    featured: true
  },
  {
    title: 'Inside ASEAN’s Quiet Push for Digital Trade Standards',
    slug: 'asean-digital-trade-standards',
    dek: 'The region’s next trade advantage may be written in interoperable rules, trusted data, and practical diplomacy.',
    category: categories[1],
    publishedAt: '2026-05-17',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=85',
    author: {name: 'Rafi Wiratama', role: 'Global Affairs Editor'}
  },
  {
    title: 'The Family Offices Rewriting Indonesia’s Growth Map',
    slug: 'family-offices-growth-map',
    dek: 'Patient capital is moving into infrastructure, food systems, and climate technology with a longer lens.',
    category: categories[2],
    publishedAt: '2026-05-16',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=85',
    author: {name: 'Mahesa Kartiko', role: 'Business Editor'}
  },
  {
    title: 'A New Generation of Curators Brings Heritage Into the Present',
    slug: 'curators-heritage-present',
    dek: 'Museums and independent spaces are building bridges between ancestral craft and contemporary audiences.',
    category: categories[3],
    publishedAt: '2026-05-15',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85',
    author: {name: 'Dara Santoso', role: 'Culture Critic'}
  }
]

export const podcasts: MediaItem[] = [
  {
    title: 'The Briefing Room: Capital, Cities, and Climate Risk',
    slug: 'capital-cities-climate-risk',
    dek: 'A weekly editorial conversation on the forces moving Indonesia and the region.',
    publishedAt: '2026-05-14',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1400&q=85',
    duration: '42 min'
  },
  {
    title: 'Signal: Why Maritime Policy Is Back on the Table',
    slug: 'maritime-policy-signal',
    dek: 'Policy editors unpack the ports, vessels, insurance, and security agenda behind the headlines.',
    publishedAt: '2026-05-10',
    image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1400&q=85',
    duration: '29 min'
  }
]

export const videos: MediaItem[] = [
  {
    title: 'Narapati Journal Dispatch: Jakarta’s Transit-Oriented Future',
    slug: 'jakarta-transit-oriented-future',
    dek: 'A field report on how mixed-use districts are changing the daily rhythm of the capital.',
    publishedAt: '2026-05-12',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=85',
    duration: '08:16'
  },
  {
    title: 'Studio Interview: The Economics of Trust',
    slug: 'economics-of-trust',
    dek: 'An extended conversation with economists and operators on institutional confidence.',
    publishedAt: '2026-05-08',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=85',
    duration: '21:40'
  }
]

export const photography: MediaItem[] = [
  {
    title: 'Visual Essay: The Quiet Discipline of a Modern Newsroom',
    slug: 'quiet-discipline-modern-newsroom',
    dek: 'A photographic look at editorial rituals, research walls, and the calm machinery behind premium reporting.',
    publishedAt: '2026-05-11',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85',
    duration: 'Jakarta'
  },
  {
    title: 'Frames From Indonesia’s New Business Districts',
    slug: 'frames-indonesia-business-districts',
    dek: 'Architecture, mobility, and ambition captured through the changing lines of Indonesia’s commercial centers.',
    publishedAt: '2026-05-07',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=85',
    duration: 'Indonesia'
  }
]

export const siteSettings: SiteSettings = {
  siteTitle: 'Narapati Journal',
  tagline: 'Independen. Visioner. Untuk Indonesia.',
  description: 'Media independen untuk bisnis, kepemimpinan, nilai hidup, video, dan photography.',
  address: 'Jakarta, Indonesia - alamat kantor menyusul',
  contactEmail: 'hello@narapati.news',
  whatsapp: '+62 812 0000 2026',
  instagram: 'https://instagram.com/narapatinewsnetwork',
  youtube: 'https://youtube.com/@narapatinewsnetwork',
  tiktok: '',
  linkedin: 'https://linkedin.com/company/narapati-news-network',
  twitterX: 'https://x.com/narapatinews',
  privacyText: 'Narapati Journal menghormati privasi pembaca dan mengelola data sesuai kebutuhan layanan digital.',
  kodeEtikText: 'Ruang redaksi Narapati Journal bekerja dengan prinsip akurasi, independensi, akuntabilitas, dan hak jawab.',
  footerCopyright: '© 2026 Narapati Journal. All rights reserved.',
  aboutContent:
    'Narapati Journal adalah platform media digital independen yang menghadirkan jurnalisme premium tentang bisnis, kepemimpinan, nilai hidup, video, dan photography.\n\nNarapati Journal dibangun untuk pembaca yang membutuhkan konteks, kejernihan, dan perspektif editorial yang matang.',
  redaksiContent:
    'Ruang redaksi Narapati disusun untuk peliputan yang terukur, akuntabel, dan berorientasi pada kualitas. Setiap materi editorial melewati proses penyuntingan dan penilaian konteks sebelum dipublikasikan.',
  contactContent:
    'Gunakan kanal resmi Narapati untuk pertanyaan redaksi, kerja sama, undangan liputan, dan komunikasi bisnis.',
  advertiseContent:
    'Narapati membuka ruang kerja sama untuk media placement, sponsor, advertorial, video partnership, dan photography coverage dengan pendekatan premium.'
}
