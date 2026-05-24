import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Narapati CMS')
    .items([
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('video').title('Video'),
      S.documentTypeListItem('photography').title('Photography'),
      S.documentTypeListItem('siteSettings').title('Site Settings'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !['article', 'category', 'author', 'video', 'photography', 'podcast', 'siteSettings'].includes(item.getId()!),
      ),
    ])
