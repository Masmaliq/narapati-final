import 'server-only'

import {promises as fs} from 'fs'
import path from 'path'
import {homeContent, type HomeContent} from '@/content/home'

const homeContentPath = path.join(process.cwd(), 'src/content/home.json')

function asString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

export function normalizeHomeContent(value: unknown): HomeContent {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}

  return {
    heroLabel: asString(source.heroLabel, homeContent.heroLabel),
    heroTitle: asString(source.heroTitle, homeContent.heroTitle),
    heroDescription: asString(source.heroDescription, homeContent.heroDescription),
    quoteText: asString(source.quoteText, homeContent.quoteText),
    quoteSource: asString(source.quoteSource, homeContent.quoteSource)
  }
}

export async function getHomeContent() {
  try {
    const file = await fs.readFile(homeContentPath, 'utf8')
    return normalizeHomeContent(JSON.parse(file))
  } catch {
    return homeContent
  }
}

export async function saveHomeContent(content: unknown) {
  const normalizedContent = normalizeHomeContent(content)
  await fs.writeFile(homeContentPath, `${JSON.stringify(normalizedContent, null, 2)}\n`, 'utf8')
  return normalizedContent
}
