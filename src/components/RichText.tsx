export function TextBlocks({text}: {text?: string | null}) {
  if (!text?.trim()) {
    return null
  }

  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  )
}
