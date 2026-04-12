import 'server-only'

import { promises as fs } from 'fs'
import path from 'path'

import { extractSummary, splitMarkdownSections } from './command-markdown'

const PUBLIC_DIRECTORY = path.join(process.cwd(), 'public')

function createCommandRecord({ kind, name, manual, output = '', source }) {
  return {
    kind,
    name,
    manual,
    output,
    summary: extractSummary(manual),
    source,
  }
}

async function readFlatMarkdownDirectory(relativeDirectory, kind) {
  const directoryPath = path.join(PUBLIC_DIRECTORY, relativeDirectory)
  const filenames = (await fs.readdir(directoryPath))
    .filter((filename) => filename.endsWith('.md'))
    .sort()

  return Promise.all(
    filenames.map(async (filename) => {
      const source = await fs.readFile(path.join(directoryPath, filename), 'utf8')
      const { manual, output } = splitMarkdownSections(source)

      return createCommandRecord({
        kind,
        name: path.basename(filename, '.md'),
        manual,
        output,
        source: filename,
      })
    })
  )
}

async function readContentFiles(relativeDirectory) {
  const directoryPath = path.join(PUBLIC_DIRECTORY, relativeDirectory)
  const filenames = (await fs.readdir(directoryPath))
    .filter((filename) => filename.endsWith('.md'))
    .sort()

  return Promise.all(
    filenames.map(async (filename) => {
      const source = await fs.readFile(path.join(directoryPath, filename), 'utf8')

      return {
        name: path.basename(filename, '.md'),
        body: source.trim(),
        source: filename,
      }
    })
  )
}

async function collectMarkdownFiles(directoryPath, relativePath = '') {
  const directoryEntries = await fs.readdir(directoryPath, { withFileTypes: true })
  const sortedEntries = directoryEntries.sort((left, right) =>
    left.name.localeCompare(right.name)
  )

  const files = []

  for (const entry of sortedEntries) {
    const nextRelativePath = relativePath
      ? path.join(relativePath, entry.name)
      : entry.name
    const entryPath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(entryPath, nextRelativePath)))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(nextRelativePath)
    }
  }

  return files
}

function tokensToCommandName(tokens) {
  return tokens.join(' ')
}

function shouldReplaceManualEntry(existingEntry, nextEntry) {
  if (!existingEntry) {
    return true
  }

  return nextEntry.source.endsWith('/index.md')
}

function buildKnownParentCommands(...commandGroups) {
  return commandGroups
    .flat()
    .map((command) => command.name.split(/\s+/)[0]?.toLowerCase())
    .filter(Boolean)
    .filter((commandName, index, commandNames) => commandNames.indexOf(commandName) === index)
    .sort()
}

async function readCustomCommands(relativeDirectory) {
  const directoryPath = path.join(PUBLIC_DIRECTORY, relativeDirectory)
  const markdownFiles = await collectMarkdownFiles(directoryPath)

  const runnableCommands = []
  const manualEntriesByName = new Map()

  for (const relativeFilePath of markdownFiles) {
    const source = await fs.readFile(path.join(directoryPath, relativeFilePath), 'utf8')
    const { manual, output } = splitMarkdownSections(source)
    const fileTokens = relativeFilePath
      .replace(/\.md$/u, '')
      .split(path.sep)
      .filter(Boolean)
    const isIndexFile = fileTokens[fileTokens.length - 1] === 'index'
    const commandTokens = isIndexFile ? fileTokens.slice(0, -1) : fileTokens
    const commandName = tokensToCommandName(commandTokens)

    if (!commandName) {
      continue
    }

    const manualEntry = createCommandRecord({
      kind: 'custom',
      name: commandName,
      manual,
      output,
      source: relativeFilePath,
    })

    if (shouldReplaceManualEntry(manualEntriesByName.get(commandName), manualEntry)) {
      manualEntriesByName.set(commandName, manualEntry)
    }

    if (!isIndexFile) {
      runnableCommands.push(
        createCommandRecord({
          kind: 'custom',
          name: commandName,
          manual,
          output,
          source: relativeFilePath,
        })
      )
    }
  }

  runnableCommands.sort((left, right) => left.name.localeCompare(right.name))

  return {
    customManualEntries: [...manualEntriesByName.values()].sort((left, right) =>
      left.name.localeCompare(right.name)
    ),
    customRunnableCommands: runnableCommands,
  }
}

export async function loadTerminalContent() {
  const [builtins, customCommands, contentEntries] = await Promise.all([
    readFlatMarkdownDirectory('commands/builtins', 'builtin'),
    readCustomCommands('commands/custom'),
    readContentFiles('content'),
  ])
  const welcomeMarkdown =
    contentEntries.find((entry) => entry.name === 'intro')?.body ?? ''

  return {
    builtins,
    contentEntries,
    ...customCommands,
    knownParentCommands: buildKnownParentCommands(
      builtins,
      customCommands.customManualEntries,
      customCommands.customRunnableCommands
    ),
    welcomeMarkdown: welcomeMarkdown.trim(),
  }
}
