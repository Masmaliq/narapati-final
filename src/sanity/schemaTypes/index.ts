import {articleType} from './article'
import {authorType} from './author'
import {categoryType} from './category'
import {photographyType, podcastType, videoType} from './media'
import {siteSettingsType} from './siteSettings'
import {homepageSettingsType} from './homepageSettings'

export const schemaTypes = [
  articleType,
  authorType,
  categoryType,
  podcastType,
  videoType,
  photographyType,
  siteSettingsType,
  homepageSettingsType
]
