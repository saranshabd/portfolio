import 'server-only'

import { loadTerminalContent } from './terminal-content'

const SITE_NAME = 'Shabd'
const SITE_TITLE_SUFFIX = ''
const DEFAULT_DESCRIPTION = "My corner on the internet"
const DEFAULT_SITE_URL = 'https://saranshabd.com'

function sanitizeSiteUrl(siteUrl) {
  return siteUrl.replace(/\/+$/u, '')
}

export function getSiteUrl() {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL

  if (!configuredSiteUrl) {
    return DEFAULT_SITE_URL
  }

  if (/^https?:\/\//u.test(configuredSiteUrl)) {
    return sanitizeSiteUrl(configuredSiteUrl)
  }

  return `https://${sanitizeSiteUrl(configuredSiteUrl)}`
}

export function getMetadataBase() {
  return new URL(getSiteUrl())
}

function buildAbsolutePath(pathname = '/') {
  return new URL(pathname, getMetadataBase()).toString()
}

function stripMarkdown(markdown = '') {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/[`*_>#-]/gu, ' ')
    .replace(/\n+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

function getFirstHeading(markdown = '') {
  const headingMatch = markdown.match(/^#\s+(.+)$/mu)
  return headingMatch?.[1]?.trim() ?? ''
}

function getDescriptionCandidate(markdown = '') {
  const withoutHeadings = markdown
    .split('\n')
    .filter((line) => !line.trim().startsWith('#'))
    .join('\n')

  return stripMarkdown(withoutHeadings)
}

function truncateDescription(description, maxLength = 160) {
  if (description.length <= maxLength) {
    return description
  }

  const sliced = description.slice(0, maxLength)
  const boundaryIndex = sliced.lastIndexOf(' ')

  if (boundaryIndex <= 80) {
    return `${sliced.trimEnd()}...`
  }

  return `${sliced.slice(0, boundaryIndex).trimEnd()}...`
}

function normalizeSegments(segments = []) {
  return segments.map((segment) => decodeURIComponent(segment))
}

function buildRoutePath(segments = []) {
  return normalizeSegments(segments).join('/').trim().toLowerCase()
}

function findCommandEntry(routePath, terminalContent) {
  if (!routePath) {
    return null
  }

  const commandGroups = [
    terminalContent.customManualEntries,
    terminalContent.customRunnableCommands,
    terminalContent.builtins,
  ]

  for (const commandGroup of commandGroups) {
    const matchedCommand = commandGroup.find((entry) => entry.name === routePath)

    if (matchedCommand) {
      return matchedCommand
    }
  }

  return null
}

function buildDescription(markdown, fallbackDescription = DEFAULT_DESCRIPTION) {
  const descriptionCandidate = getDescriptionCandidate(markdown)

  if (!descriptionCandidate) {
    return fallbackDescription
  }

  return truncateDescription(descriptionCandidate)
}

function buildMetadata({
  title,
  description,
  pathname = '/',
  robots,
}) {
  const canonical = buildAbsolutePath(pathname)

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: pathname === '/' ? 'website' : 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots,
  }
}

export async function getRootMetadata() {
  const terminalContent = await loadTerminalContent()
  const welcomeHeading = getFirstHeading(terminalContent.welcomeMarkdown)
  const title = welcomeHeading
    ? `${SITE_NAME} | ${welcomeHeading}`
    : `${SITE_NAME} | ${SITE_TITLE_SUFFIX}`

  return buildMetadata({
    title,
    description: buildDescription(terminalContent.welcomeMarkdown),
    pathname: '/',
  })
}

export async function getRouteMetadata(segments = []) {
  const terminalContent = await loadTerminalContent()
  const routePath = buildRoutePath(segments)
  const pathname = routePath ? `/${routePath}` : '/'
  const matchedContentEntry = terminalContent.contentEntries.find(
    (entry) => entry.name === routePath
  )

  if (matchedContentEntry) {
    const heading = getFirstHeading(matchedContentEntry.body) || matchedContentEntry.name
    return buildMetadata({
      title: `${SITE_NAME} | ${heading}`,
      description: buildDescription(matchedContentEntry.body),
      pathname,
    })
  }

  const matchedCommand = findCommandEntry(routePath, terminalContent)

  if (matchedCommand) {
    const heading = getFirstHeading(matchedCommand.manual) || matchedCommand.name
    return buildMetadata({
      title: `${SITE_NAME} | ${heading}`,
      description: buildDescription(matchedCommand.manual),
      pathname,
    })
  }

  return buildMetadata({
    title: `${SITE_NAME} | Not Found`,
    description: 'This terminal route does not map to a public page.',
    pathname,
    robots: {
      index: false,
      follow: false,
    },
  })
}

export async function getIndexableRoutes() {
  const terminalContent = await loadTerminalContent()
  const routePaths = new Set(['/'])

  for (const entry of terminalContent.contentEntries) {
    routePaths.add(`/${entry.name}`)
  }

  for (const entry of terminalContent.customManualEntries) {
    routePaths.add(`/${entry.name.replace(/\s+/gu, '/')}`)
  }

  for (const entry of terminalContent.customRunnableCommands) {
    routePaths.add(`/${entry.name.replace(/\s+/gu, '/')}`)
  }

  return [...routePaths].sort((left, right) => left.localeCompare(right))
}
