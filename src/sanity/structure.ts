import type {StructureResolver} from 'sanity/structure'
import {NewsroomDashboard} from './components/NewsroomDashboard'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Narapati Studio')
    .items([
      S.listItem()
        .title('Dashboard')
        .child(S.component(NewsroomDashboard).title('Dashboard Overview')),
      S.divider(),
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('photography').title('Photography'),
      S.documentTypeListItem('video').title('Video Journal'),
      S.documentTypeListItem('siteSettings').title('Site Settings'),
      S.listItem()
        .title('Redaksi Page')
        .schemaType('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Redaksi Page Content')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !['article', 'category', 'author', 'video', 'photography', 'podcast', 'siteSettings'].includes(item.getId()!),
      ),
    ])
