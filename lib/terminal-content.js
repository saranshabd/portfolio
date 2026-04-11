import 'server-only'

import { promises as fs } from 'fs'
import path from 'path'

import { extractSummary, splitMarkdownSections } from './command-markdown'

const PUBLIC_DIRECTORY = path.join(process.cwd(), 'public')

async function readMarkdownDirectory(relativeDirectory, kind) {
  const directoryPath = path.join(PUBLIC_DIRECTORY, relativeDirectory)
  const filenames = (await fs.readdir(directoryPath))
    .filter((filename) => filename.endsWith('.md'))
    .sort()

  return Promise.all(
    filenames.map(async (filename) => {
      const source = await fs.readFile(path.join(directoryPath, filename), 'utf8')
      const { manual, output } = splitMarkdownSections(source)

      return {
        kind,
        name: path.basename(filename, '.md'),
        manual,
        output,
        summary: extractSummary(manual),
      }
    })
  )
}

export async function loadTerminalContent() {
  const [builtins, customCommands, welcomeMarkdown] = await Promise.all([
    readMarkdownDirectory('commands/builtins', 'builtin'),
    readMarkdownDirectory('commands/custom', 'custom'),
    fs.readFile(path.join(PUBLIC_DIRECTORY, 'content/welcome.md'), 'utf8'),
  ])

  return {
    builtins,
    customCommands,
    welcomeMarkdown: welcomeMarkdown.trim(),
  }
}
