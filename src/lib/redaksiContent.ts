import 'server-only'

import {promises as fs} from 'fs'
import path from 'path'
import {redaksiContent, type RedaksiCard, type RedaksiContent} from '@/content/redaksi'
import {isSanityConfigured} from '@/sanity/env'
import {client} from '@/sanity/lib/client'

const redaksiContentPath = path.join(process.cwd(), 'src/content/redaksi.json')
const redaksiSettingsId = 'siteSettings'

function asString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

function normalizeCards(value: unknown): RedaksiCard[] {
  const fallbackCards = redaksiContent.cards

  if (!Array.isArray(value)) {
    return fallbackCards
  }

  const cards = value
    .map((card, index) => {
      const fallback = fallbackCards[index] || {label: '', title: '', description: ''}

      if (!card || typeof card !== 'object') {
        return fallback
      }

      const item = card as Record<string, unknown>

      return {
        label: asString(item.label, fallback.label),
        title: asString(item.title, fallback.title),
        description: asString(item.description, fallback.description)
      }
    })
    .filter((card) => card.label.trim() || card.title.trim() || card.description.trim())

  return cards.length ? cards : fallbackCards
}

export function normalizeRedaksiContent(value: unknown): RedaksiContent {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}

  return {
    heroLabel: asString(source.heroLabel, redaksiContent.heroLabel),
    heroTitle: asString(source.heroTitle, redaksiContent.heroTitle),
    heroDescription: asString(source.heroDescription, redaksiContent.heroDescription),
    introLabel: asString(source.introLabel, redaksiContent.introLabel),
    introTitle: asString(source.introTitle, redaksiContent.introTitle),
    introDescription: asString(source.introDescription, redaksiContent.introDescription),
    mastheadLabel: asString(source.mastheadLabel, redaksiContent.mastheadLabel),
    mastheadTitle: asString(source.mastheadTitle, redaksiContent.mastheadTitle),
    ethicsTitle: asString(source.ethicsTitle, redaksiContent.ethicsTitle),
    ethicsDescription: asString(source.ethicsDescription, redaksiContent.ethicsDescription),
    ethicsContactText: asString(source.ethicsContactText, redaksiContent.ethicsContactText),
    cards: normalizeCards(source.cards)
  }
}

function parseRedaksiText(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

async function getFileRedaksiContent() {
  try {
    const file = await fs.readFile(redaksiContentPath, 'utf8')
    return normalizeRedaksiContent(JSON.parse(file))
  } catch {
    return redaksiContent
  }
}

export async function getRedaksiContent() {
  if (isSanityConfigured) {
    try {
      const settings = await client.fetch<{redaksiContent?: string} | null>(
        `*[_type == "siteSettings" && _id == $id][0]{redaksiContent}`,
        {id: redaksiSettingsId},
        {cache: 'no-store'}
      )
      const parsedContent = parseRedaksiText(settings?.redaksiContent)

      if (parsedContent) {
        return normalizeRedaksiContent(parsedContent)
      }
    } catch {
      return getFileRedaksiContent()
    }
  }

  return getFileRedaksiContent()
}

async function saveFileRedaksiContent(content: RedaksiContent) {
  await fs.writeFile(redaksiContentPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8')
}

export async function saveRedaksiContent(content: unknown) {
  const normalizedContent = normalizeRedaksiContent(content)
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (isSanityConfigured && token) {
    const writeClient = client.withConfig({
      token,
      useCdn: false
    })

    await writeClient.createIfNotExists({
      _id: redaksiSettingsId,
      _type: 'siteSettings'
    })

    await writeClient
      .patch(redaksiSettingsId)
      .set({
        redaksiContent: JSON.stringify(normalizedContent, null, 2)
      })
      .commit()

    return normalizedContent
  }

  try {
    await saveFileRedaksiContent(normalizedContent)
    return normalizedContent
  } catch (error) {
    if (isSanityConfigured && !token) {
      throw new Error('Missing SANITY_API_WRITE_TOKEN for Redaksi content save.', {cause: error})
    }

    throw error
  }
}
