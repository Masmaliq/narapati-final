'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'narapati-news-network',
  title: 'Narapati News Network',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool({defaultApiVersion: apiVersion})],
  schema: {types: schemaTypes}
})
