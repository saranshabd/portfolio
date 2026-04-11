export function splitMarkdownSections(markdown) {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n')
  const dividerPattern = /^---$/m
  const dividerMatch = normalizedMarkdown.match(dividerPattern)

  if (!dividerMatch || dividerMatch.index === undefined) {
    return {
      manual: normalizedMarkdown.trim(),
      output: '',
    }
  }

  const dividerIndex = dividerMatch.index
  const dividerLength = dividerMatch[0].length

  return {
    manual: normalizedMarkdown.slice(0, dividerIndex).trim(),
    output: normalizedMarkdown.slice(dividerIndex + dividerLength).trim(),
  }
}

export function extractSummary(markdown) {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n')
  const lines = normalizedMarkdown
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const summaryLine = lines.find((line) => !line.startsWith('#'))

  return summaryLine
    ? summaryLine
        .replace(/^\-\s+/, '')
        .replace(/[`*_>#]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : ''
}
