const fs = require('fs')
const path = require('path')

const { expect, test } = require('@playwright/test')

const ROOT_DIRECTORY = process.cwd()
const CUSTOM_COMMANDS_DIRECTORY = path.join(
  ROOT_DIRECTORY,
  'public',
  'commands',
  'custom'
)
const BUILTIN_COMMANDS_DIRECTORY = path.join(
  ROOT_DIRECTORY,
  'public',
  'commands',
  'builtins'
)

function splitMarkdownSections(markdown) {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n')
  const dividerMatch = normalizedMarkdown.match(/^---$/m)

  if (!dividerMatch || dividerMatch.index === undefined) {
    return {
      manual: normalizedMarkdown.trim(),
      output: '',
    }
  }

  return {
    manual: normalizedMarkdown.slice(0, dividerMatch.index).trim(),
    output: normalizedMarkdown
      .slice(dividerMatch.index + dividerMatch[0].length)
      .trim(),
  }
}

function extractAssertionText(markdown) {
  const candidate = markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#'))

  return candidate
    ? candidate
        .replace(/^\-\s+/, '')
        .replace(/[`*_>#]/g, '')
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
        .trim()
    : ''
}

function extractSummary(markdown) {
  return extractAssertionText(markdown)
}

function collectMarkdownFiles(directory, relativePath = '') {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const nextRelativePath = relativePath
        ? path.join(relativePath, entry.name)
        : entry.name
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        return collectMarkdownFiles(entryPath, nextRelativePath)
      }

      return entry.isFile() && entry.name.endsWith('.md') ? [nextRelativePath] : []
    })
}

function createCommandMap(commands) {
  return commands.reduce((commandMap, command) => {
    commandMap[command.name] = command
    return commandMap
  }, {})
}

function collapseVariantBranch(node, prefixTokens = []) {
  const branchTokens = [...prefixTokens, node.token]

  if (!node.isRunnable && node.children.length === 1) {
    return collapseVariantBranch(node.children[0], branchTokens)
  }

  return {
    label: branchTokens.join(' '),
    node,
  }
}

function getSummaryForNode(commandName, manualIndex, runnableIndex) {
  return manualIndex[commandName]?.summary ?? runnableIndex[commandName]?.summary ?? ''
}

function buildGroupedHelpEntries(runnableCommands, manualEntries) {
  const rootNodes = []
  const nodesByPath = new Map()
  const manualIndex = createCommandMap(manualEntries)
  const runnableIndex = createCommandMap(runnableCommands)

  for (const command of runnableCommands) {
    const tokens = command.name.split(' ')
    let parentNode = null
    let pathKey = ''

    for (const token of tokens) {
      pathKey = pathKey ? `${pathKey} ${token}` : token

      if (!nodesByPath.has(pathKey)) {
        const node = {
          token,
          path: pathKey,
          isRunnable: false,
          children: [],
        }

        nodesByPath.set(pathKey, node)

        if (parentNode) {
          parentNode.children.push(node)
        } else {
          rootNodes.push(node)
        }
      }

      parentNode = nodesByPath.get(pathKey)
    }

    if (parentNode) {
      parentNode.isRunnable = true
    }
  }

  return rootNodes
    .map((node) => {
      const commandName = node.path

      if (node.children.length === 0) {
        return {
          label: commandName,
          summary: getSummaryForNode(commandName, manualIndex, runnableIndex),
        }
      }

      const variants = node.children
        .map((childNode) => collapseVariantBranch(childNode))
        .map((childBranch) => childBranch.label)

      return {
        label: `${commandName} {${variants.join(', ')}}`,
        summary: getSummaryForNode(commandName, manualIndex, runnableIndex),
      }
    })
    .sort((left, right) => left.label.localeCompare(right.label))
}

function readBuiltinFixtures(directory) {
  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith('.md'))
    .sort()
    .map((filename) => {
      const source = fs.readFileSync(path.join(directory, filename), 'utf8')
      const { manual, output } = splitMarkdownSections(source)

      return {
        name: path.basename(filename, '.md'),
        manual,
        output,
        summary: extractSummary(manual),
      }
    })
}

function readCustomFixtures(directory) {
  const files = collectMarkdownFiles(directory)
  const runnableCommands = []
  const manualEntriesByName = new Map()

  for (const relativeFilePath of files) {
    const source = fs.readFileSync(path.join(directory, relativeFilePath), 'utf8')
    const { manual, output } = splitMarkdownSections(source)
    const fileTokens = relativeFilePath
      .replace(/\.md$/u, '')
      .split(path.sep)
      .filter(Boolean)
    const isIndexFile = fileTokens[fileTokens.length - 1] === 'index'
    const commandTokens = isIndexFile ? fileTokens.slice(0, -1) : fileTokens
    const name = commandTokens.join(' ')

    if (!name) {
      continue
    }

    const record = {
      name,
      manual,
      output,
      summary: extractSummary(manual),
      source: relativeFilePath,
    }

    const existingManual = manualEntriesByName.get(name)
    if (!existingManual || relativeFilePath.endsWith(`${path.sep}index.md`)) {
      manualEntriesByName.set(name, record)
    }

    if (!isIndexFile) {
      runnableCommands.push(record)
    }
  }

  return {
    manualEntries: [...manualEntriesByName.values()].sort((left, right) =>
      left.name.localeCompare(right.name)
    ),
    runnableCommands: runnableCommands.sort((left, right) =>
      left.name.localeCompare(right.name)
    ),
  }
}

async function runCommand(page, command) {
  const input = page.getByTestId('terminal-input')
  await input.fill(command)
  await input.press('Enter')
}

async function setInputSelection(input, selectionStart, selectionEnd = selectionStart) {
  await input.evaluate(
    (node, { start, end }) => {
      node.focus()
      node.setSelectionRange(start, end)
    },
    { start: selectionStart, end: selectionEnd }
  )
}

async function expectMirroredInput(page, expectedValue) {
  const input = page.getByTestId('terminal-input')
  const display = page.getByTestId('terminal-input-display')
  const mirroredText = await display.evaluate((node) =>
    (node.textContent ?? '').replace(/\u00a0/gu, '')
  )

  await expect(input).toHaveValue(expectedValue)
  expect(mirroredText).toBe(expectedValue)
}

async function readTextColor(locator) {
  return locator.evaluate((node) => window.getComputedStyle(node).color)
}

async function readPersistedRootSession(page) {
  return page.evaluate(async () => {
    const DATABASE_NAME = 'terminal-portfolio'
    const STORE_NAME = 'shell'
    const ROOT_SESSION_KEY = 'root-session'

    return await new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DATABASE_NAME, 2)

      request.onupgradeneeded = () => {
        const database = request.result

        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME)
        }
      }

      request.onsuccess = () => {
        const database = request.result
        const transaction = database.transaction(STORE_NAME, 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get(ROOT_SESSION_KEY)

        getRequest.onsuccess = () => {
          database.close()
          resolve(getRequest.result ?? null)
        }

        getRequest.onerror = () => {
          database.close()
          reject(getRequest.error)
        }
      }

      request.onerror = () => reject(request.error)
    })
  })
}

test('first root visit shows the welcome markdown panel', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByText('Welcome to my corner on the internet')
  ).toBeVisible()
  await expect(
    page.getByText('Start with help to see what is installed', { exact: false })
  ).toBeVisible()
})

test('help lists built-ins and grouped custom commands', async ({ page }) => {
  const builtins = readBuiltinFixtures(BUILTIN_COMMANDS_DIRECTORY)
  const customFixtures = readCustomFixtures(CUSTOM_COMMANDS_DIRECTORY)
  const groupedHelpEntries = buildGroupedHelpEntries(
    customFixtures.runnableCommands,
    customFixtures.manualEntries
  )

  await page.goto('/')
  await runCommand(page, 'help')

  await expect(page.getByText('Available Commands')).toBeVisible()
  await expect(page.getByTestId('terminal-output')).toContainText('Built-ins')
  await expect(page.getByTestId('terminal-output')).toContainText('Custom')

  for (const builtin of builtins) {
    await expect(page.getByTestId('terminal-output')).toContainText(builtin.name)
  }

  for (const entry of groupedHelpEntries) {
    await expect(page.getByTestId('terminal-output')).toContainText(entry.label)

    if (entry.summary) {
      await expect(page.getByTestId('terminal-output')).toContainText(entry.summary)
    }
  }
})

test('custom commands render recursive markdown-backed output', async ({ page }) => {
  const { runnableCommands } = readCustomFixtures(CUSTOM_COMMANDS_DIRECTORY)

  await page.goto('/')

  for (const command of runnableCommands) {
    await runCommand(page, command.name)
    await expect(
      page.getByText(extractAssertionText(command.output), { exact: false })
    ).toBeVisible()
  }
})

test('built-in and directory-backed manuals are reachable through man', async ({
  page,
}) => {
  const builtins = readBuiltinFixtures(BUILTIN_COMMANDS_DIRECTORY)
  const { manualEntries } = readCustomFixtures(CUSTOM_COMMANDS_DIRECTORY)

  await page.goto('/')

  for (const builtin of builtins) {
    await runCommand(page, `man ${builtin.name}`)
    await expect(
      page.getByText(extractAssertionText(builtin.manual), { exact: false })
    ).toBeVisible()
  }

  for (const command of ['about', 'status']) {
    const manualEntry = manualEntries.find((entry) => entry.name === command)

    await runCommand(page, `man ${command}`)
    await expect(
      page.getByText(extractAssertionText(manualEntry.manual), { exact: false })
    ).toBeVisible()
  }
})

test('bare parents, invalid subcommands, and gibberish commands show shell-style errors', async ({
  page,
}) => {
  await page.goto('/')

  for (const invalidCommand of ['status', 'status nonsense', 'asdlkj']) {
    await runCommand(page, invalidCommand)
  }

  await expect(page.getByText('command not found', { exact: false })).toHaveCount(
    3
  )
  await expect(
    page.getByText('Run help to inspect available commands.', { exact: false })
  ).toHaveCount(3)
})

test('root history persists across reload and clear leaves the root blank', async ({
  page,
}) => {
  await page.goto('/')

  await runCommand(page, 'about')
  await runCommand(page, 'help')

  await expect(
    page.getByText('I work as a software engineer', { exact: false })
  ).toBeVisible()

  await page.reload()

  await expect(
    page.getByText('I work as a software engineer', { exact: false })
  ).toBeVisible()
  await expect(page.getByText('Available Commands')).toBeVisible()

  await runCommand(page, 'clear')
  await expect(page.getByTestId('terminal-entry')).toHaveCount(0)

  const persistedSession = await readPersistedRootSession(page)

  expect(persistedSession).toEqual({
    initialized: true,
    entries: [],
  })

  await page.reload()

  await expect(page.getByTestId('terminal-entry')).toHaveCount(0)
  await expect(
    page.getByText('Welcome to my corner on the internet')
  ).toHaveCount(0)
})

test('subroutes auto-run derived commands and ignore persisted root history', async ({
  page,
}) => {
  await page.goto('/')
  await runCommand(page, 'about')
  await runCommand(page, 'writing')

  await expect(page.getByText('Ares 3 on Substack', { exact: false })).toBeVisible()

  await page.goto('/about')

  await expect(
    page.getByText('shabd@portfolio:~$ about', { exact: false })
  ).toBeVisible()
  await expect(
    page.getByText('I work as a software engineer', { exact: false })
  ).toBeVisible()
  await expect(page.getByText('Ares 3 on Substack', { exact: false })).toHaveCount(0)
})

test('nested subroutes auto-run the full token path and reset on reload', async ({
  page,
}) => {
  await page.goto('/birthday/2023')

  await expect(
    page.getByText('shabd@portfolio:~$ birthday 2023', { exact: false })
  ).toBeVisible()
  await expect(
    page.getByText('2023 was quieter than expected', { exact: false })
  ).toBeVisible()

  await runCommand(page, 'about')
  await expect(
    page.getByText('I work as a software engineer', { exact: false })
  ).toBeVisible()

  await page.reload()

  await expect(
    page.getByText('shabd@portfolio:~$ birthday 2023', { exact: false })
  ).toBeVisible()
  await expect(
    page.getByText('2023 was quieter than expected', { exact: false })
  ).toBeVisible()
  await expect(
    page.getByText('I work as a software engineer', { exact: false })
  ).toHaveCount(0)
})

test('invalid routes use the normal command-not-found output instead of a framework 404', async ({
  page,
}) => {
  await page.goto('/totally/made/up')

  await expect(
    page.getByText('shabd@portfolio:~$ totally made up', { exact: false })
  ).toBeVisible()
  await expect(page.getByText('command not found', { exact: false })).toBeVisible()
  await expect(page.getByTestId('terminal-shell')).toBeVisible()
})

test('new terminal output scrolls to the bottom after each command', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 720 })
  await page.goto('/')

  for (let index = 0; index < 12; index += 1) {
    await runCommand(page, 'writing')
  }

  await expect(page.getByTestId('terminal-input-bar')).toBeInViewport()

  const scrollMetrics = await page.getByTestId('terminal-output').evaluate((node) => ({
    clientHeight: node.clientHeight,
    scrollHeight: node.scrollHeight,
    scrollTop: node.scrollTop,
  }))

  expect(scrollMetrics.scrollTop + scrollMetrics.clientHeight).toBeGreaterThanOrEqual(
    scrollMetrics.scrollHeight - 4
  )
})

test('typing after clicking terminal content still targets the input', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByText('Welcome to my corner on the internet').click()
  await page.keyboard.type('about')
  await page.keyboard.press('Enter')

  await expect(
    page.getByText('I work as a software engineer', { exact: false })
  ).toBeVisible()
  await expect(page.getByTestId('terminal-input')).toHaveValue('')
})

test('Ctrl+W deletes the previous word and keeps the mirrored display in sync', async ({
  page,
}) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')
  const parentToken = page.getByTestId('terminal-input-parent-token')
  const suffix = page.getByTestId('terminal-input-suffix')

  await input.fill('status professional')
  await input.press('Control+w')

  await expectMirroredInput(page, 'status ')
  await expect(parentToken).toHaveText('status')
  await expect(parentToken).toHaveClass(
    /terminal-input-parent-token--highlighted/
  )
  await expect(suffix).toHaveText(' ')
})

test('Ctrl+U deletes to the caret and keeps the mirrored display in sync', async ({
  page,
}) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')
  const parentToken = page.getByTestId('terminal-input-parent-token')

  await input.fill('status professional')
  await setInputSelection(input, 6)
  await input.press('Control+u')

  await expectMirroredInput(page, ' professional')
  await expect(parentToken).toHaveText('professional')
  await expect(parentToken).not.toHaveClass(
    /terminal-input-parent-token--highlighted/
  )
})

test('Ctrl+W deletes the current selection', async ({ page }) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')

  await input.fill('status professional')
  await setInputSelection(input, 7, 'status professional'.length)
  await input.press('Control+w')

  await expectMirroredInput(page, 'status ')
})

test('Ctrl+U deletes from the start of the line to the selection end', async ({
  page,
}) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')

  await input.fill('status professional')
  await setInputSelection(input, 7, 'status professional'.length)
  await input.press('Control+u')

  await expectMirroredInput(page, '')
})

test('commands still submit normally after readline-style shortcut edits', async ({
  page,
}) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')

  await input.fill('status professional')
  await input.press('Control+w')
  await input.type(' professional')
  await input.press('Enter')

  await expect(
    page.getByText('Bengaluru, India', { exact: false })
  ).toBeVisible()
  await expect(input).toHaveValue('')
})

test('recognized parent commands highlight only the first input token', async ({
  page,
}) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')
  const parentToken = page.getByTestId('terminal-input-parent-token')
  const suffix = page.getByTestId('terminal-input-suffix')
  const display = page.getByTestId('terminal-input-display')

  for (const command of ['help', 'man', 'about', 'status', 'birthday']) {
    await input.fill(command)
    await expect(parentToken).toHaveText(command)
    await expect(parentToken).toHaveClass(
      /terminal-input-parent-token--highlighted/
    )
  }

  await input.fill('asdlkj')
  await expect(parentToken).toHaveText('asdlkj')
  await expect(parentToken).not.toHaveClass(
    /terminal-input-parent-token--highlighted/
  )

  await input.fill('sta')
  await expect(parentToken).toHaveText('sta')
  await expect(parentToken).not.toHaveClass(
    /terminal-input-parent-token--highlighted/
  )

  await input.fill('status professional')
  await expect(parentToken).toHaveText('status')
  await expect(parentToken).toHaveClass(
    /terminal-input-parent-token--highlighted/
  )
  await expect(suffix).toHaveText(' professional')

  await input.fill('birthday 2023')
  await expect(parentToken).toHaveText('birthday')
  await expect(parentToken).toHaveClass(
    /terminal-input-parent-token--highlighted/
  )
  await expect(suffix).toHaveText(' 2023')

  const parentColor = await readTextColor(parentToken)
  const suffixColor = await readTextColor(suffix)
  const displayColor = await readTextColor(display)

  expect(parentColor).not.toBe(displayColor)
  expect(suffixColor).toBe(displayColor)
})

test.describe('responsive smoke', () => {
  test.use({
    viewport: { width: 390, height: 844 },
  })

  test('terminal shell remains usable on mobile', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('terminal-input')).toBeVisible()

    await runCommand(page, 'status professional')

    await expect(page.getByText('Bengaluru, India', { exact: false })).toBeVisible()
  })
})
