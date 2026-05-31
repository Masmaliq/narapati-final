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
  'homepageSettings'
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Narapati Studio')
    .items([
      S.listItem()
        .title('Dashboard')
        .icon(DashboardIcon)
        .child(S.component(NewsroomDashboard).title('Dashboard Overview')),

      S.divider(),

      S.listItem()
        .title('JOURNAL')
        .icon(BookIcon)
        .child(
          S.list()
            .title('JOURNAL')
            .items([
              S.documentTypeListItem('article')
                .title('All Articles')
                .icon(DocumentTextIcon),
              S.listItem()
                .title('Drafts')
                .icon(EditIcon)
                .schemaType('article')
                .child(
                  S.documentList()
                    .title('Draft Articles')
                    .schemaType('article')
                    .filter('_type == "article" && _id in path("drafts.**")')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Published')
                .icon(PublishIcon)
                .schemaType('article')
                .child(
                  S.documentList()
                    .title('Published Articles')
                    .schemaType('article')
                    .filter('_type == "article" && !(_id in path("drafts.**"))')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Scheduled')
                .icon(CalendarIcon)
                .schemaType('article')
                .child(
                  S.documentList()
                    .title('Scheduled Articles')
                    .schemaType('article')
                    .filter('_type == "article" && !(_id in path("drafts.**")) && publishedAt > now()')
                    .defaultOrdering([{field: 'publishedAt', direction: 'asc'}])
                )
            ])
        ),

      S.listItem()
        .title('MEDIA')
        .icon(ImageIcon)
        .child(
          S.list()
            .title('MEDIA')
            .items([
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
              S.documentTypeListItem('video')
                .title('Video Journal')
                .icon(VideoIcon)
            ])
        ),

      S.listItem()
        .title('EDITORIAL')
        .icon(EditIcon)
        .child(
          S.list()
            .title('EDITORIAL')
            .items([
              S.documentTypeListItem('category')
                .title('Categories')
                .icon(TagsIcon),
              S.documentTypeListItem('author')
                .title('Authors')
                .icon(UserIcon),
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

      S.listItem()
        .title('SITE')
        .icon(CogIcon)
        .child(
          S.list()
            .title('SITE')
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
                )
            ])
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !hiddenDocumentTypes.includes(item.getId()!)
      )
    ])
