'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {NarapatiStudioIcon} from './src/sanity/components/NarapatiStudioIcon'
import {schemaTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

export default defineConfig({
  name: 'narapati-news-network',
  title: 'Narapati Studio',
  icon: NarapatiStudioIcon,
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure,
      defaultDocumentNode: (S) => S.document().views([S.view.form()])
    }),
    visionTool({defaultApiVersion: apiVersion})
  ],
  schema: {types: schemaTypes}
})
