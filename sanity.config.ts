'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

export default defineConfig({
  name: 'narapati-news-network',
  title: 'Narapati News Network',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool({structure}), visionTool({defaultApiVersion: apiVersion})],
  document: {
    actions: (prev, context) =>
      context.schemaType === 'siteSettings'
        ? prev.filter((action) => !['duplicate', 'delete'].includes(action.action || ''))
        : prev
  },
  schema: {types: schemaTypes}
})
