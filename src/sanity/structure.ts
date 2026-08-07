import {
  BookIcon,
  CalendarIcon,
  CogIcon,
  DashboardIcon,
  DocumentTextIcon,
  EditIcon,
  HomeIcon,
  ImageIcon,
  PublishIcon,
  TagsIcon,
  UserIcon,
  VideoIcon
} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'
import {EditorialCalendar} from './components/EditorialCalendar'
import {JournalArticleList, JournalDesk} from './components/JournalDesk'
import {NewsroomDashboard} from './components/NewsroomDashboard'
import {PhotographyLibrary} from './components/PhotographyLibrary'

const hiddenDocumentTypes = [
  'article',
  'category',
  'author',
  'video',
  'photography',
  'podcast',
  'siteSettings',
  'homepageSettings',
  'navigationSettings'
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Narapati Studio')
    .items([
      S.listItem()
        .title('Editorial Desk')
        .icon(DashboardIcon)
        .child(S.component(NewsroomDashboard).title('Editorial Desk')),

      S.divider(),

      S.listItem()
        .title('Journal')
        .icon(BookIcon)
        .child(
          S.list()
            .title('Journal')
            .items([
              S.listItem()
                .title('Journal Desk')
                .icon(BookIcon)
                .child(S.component(JournalDesk).title('Journal Desk')),
              S.listItem()
                .title('Semua Tulisan')
                .id('article-all')
                .icon(DocumentTextIcon)
                .schemaType('article')
                .child(
                  S.component(JournalArticleList)
                    .title('Semua Tulisan')
                    .canHandleIntent(
                      (intentName, params) =>
                        (intentName === 'edit' || intentName === 'create') &&
                        params.type === 'article'
                    )
                    .child((documentId) =>
                      S.document()
                        .schemaType('article')
                        .documentId(documentId)
                        .title('Article Editor')
                    )
                ),
              S.listItem()
                .title('Kalender Editorial')
                .id('editorial-calendar')
                .icon(CalendarIcon)
                .child(S.component(EditorialCalendar).title('Kalender Editorial')),
              S.listItem()
                .title('Draft')
                .id('article-drafts')
                .icon(EditIcon)
                .schemaType('article')
                .child(
                  S.documentList()
                    .title('Draft')
                    .schemaType('article')
                    .filter('_type == "article" && _id in path("drafts.**")')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                    .child((documentId) =>
                      S.document()
                        .schemaType('article')
                        .documentId(documentId)
                        .title('Article Editor')
                    )
                ),
              S.listItem()
                .title('Terbit')
                .id('article-published')
                .icon(PublishIcon)
                .schemaType('article')
                .child(
                  S.documentList()
                    .title('Terbit')
                    .schemaType('article')
                    .filter('_type == "article" && !(_id in path("drafts.**"))')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .child((documentId) =>
                      S.document()
                        .schemaType('article')
                        .documentId(documentId)
                        .title('Article Editor')
                    )
                ),
              S.listItem()
                .title('Terjadwal')
                .id('article-scheduled')
                .icon(CalendarIcon)
                .schemaType('article')
                .child(
                  S.documentList()
                    .title('Terjadwal')
                    .schemaType('article')
                    .filter('_type == "article" && !(_id in path("drafts.**")) && publishedAt > now()')
                    .defaultOrdering([{field: 'publishedAt', direction: 'asc'}])
                    .child((documentId) =>
                      S.document()
                        .schemaType('article')
                        .documentId(documentId)
                        .title('Article Editor')
                    )
                )
            ])
        ),

      S.documentTypeListItem('video')
        .title('Visual Journal')
        .icon(VideoIcon),

      S.listItem()
        .title('Photography')
        .icon(ImageIcon)
        .child(
          S.list()
            .title('Photography')
            .items([
              S.listItem()
                .title('Photography Library')
                .icon(ImageIcon)
                .child(S.component(PhotographyLibrary).title('Photography Library')),
              S.documentTypeListItem('photography')
                .title('All Photography Documents')
                .icon(ImageIcon)
            ])
        ),

      S.listItem()
        .title('Media Library')
        .icon(ImageIcon)
        .child(S.component(PhotographyLibrary).title('Media Library')),

      S.documentTypeListItem('author')
        .title('Authors')
        .icon(UserIcon),

      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.documentTypeListItem('siteSettings')
                .title('Site Settings')
                .icon(CogIcon),
              S.listItem()
                .title('Homepage Manager')
                .icon(HomeIcon)
                .schemaType('homepageSettings')
                .child(
                  S.document()
                    .schemaType('homepageSettings')
                    .documentId('homepageSettings')
                    .title('Homepage Manager')
                ),
              S.listItem()
                .title('Navbar Manager')
                .icon(TagsIcon)
                .schemaType('navigationSettings')
                .child(
                  S.document()
                    .schemaType('navigationSettings')
                    .documentId('navigationSettings')
                    .title('Navbar Settings')
                ),
              S.documentTypeListItem('category')
                .title('Categories')
                .icon(TagsIcon),
              S.listItem()
                .title('Redaksi Page')
                .icon(DocumentTextIcon)
                .schemaType('siteSettings')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Redaksi Page')
                ),
              S.listItem()
                .title('About Narapati')
                .icon(BookIcon)
                .schemaType('siteSettings')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('About Narapati')
                )
            ])
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !hiddenDocumentTypes.includes(item.getId()!)
      )
    ])
