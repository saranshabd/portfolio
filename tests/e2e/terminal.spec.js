const fs = require('fs')
const path = require('path')

const { expect, test } = require('@playwright/test')

const ROOT_DIRECTORY = process.cwd()
const CUSTOM_COMMANDS_DIRECTORY = path.join(ROOT_DIRECTORY, 'commands', 'custom')
const BUILTIN_COMMANDS_DIRECTORY = path.join(ROOT_DIRECTORY, 'commands', 'builtins')
const CONTENT_DIRECTORY = path.join(ROOT_DIRECTORY, 'content')
const PROMPT_PREFIX = 'internet@127.0.0.1:~$'
const ABOUT_ASSERTION = 'I was the founding engineer at Sensei'
const BIRTHDAY_ASSERTION = 'Here is the e-vite to my 24th birthday party'

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

function readContentFixtures(directory) {
  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith('.md'))
    .sort()
    .map((filename) => ({
      name: path.basename(filename, '.md'),
      body: fs.readFileSync(path.join(directory, filename), 'utf8').trim(),
      source: filename,
    }))
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

function expectPrompt(page, command) {
  return expect(
    page.locator('.terminal-prompt-line', { hasText: `${PROMPT_PREFIX}${command}` })
  ).toBeVisible()
}

async function writeLegacySession(page, session) {
  await page.evaluate(async (nextSession) => {
    const DATABASE_NAME = 'terminal-portfolio'
    const STORE_NAME = 'shell'
    const LEGACY_SESSION_KEY = 'session'

    await new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DATABASE_NAME, 2)

      request.onupgradeneeded = () => {
        const database = request.result

        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME)
        }
      }

      request.onsuccess = () => {
        const database = request.result
        const transaction = database.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)

        transaction.oncomplete = () => {
          database.close()
          resolve()
        }

        transaction.onerror = () => {
          database.close()
          reject(transaction.error)
        }

        store.put(nextSession, LEGACY_SESSION_KEY)
      }

      request.onerror = () => reject(request.error)
    })
  }, session)
}

test('first root visit shows the welcome markdown panel', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByText('Welcome to my corner on the internet')
  ).toBeVisible()
  await expect(
    page.getByText('Helpful navigation tips', { exact: false })
  ).toBeVisible()
})

test('welcome markdown highlights inline command snippets', async ({ page }) => {
  await page.goto('/')

  const helpSnippet = page.locator('.terminal-markdown code', { hasText: 'help' })
  const manSnippet = page.locator('.terminal-markdown code', { hasText: 'man <command>' })
  const clearSnippet = page.locator('.terminal-markdown code', { hasText: 'clear' })

  await expect(helpSnippet).toBeVisible()
  await expect(manSnippet).toBeVisible()
  await expect(clearSnippet).toBeVisible()
})

test('welcome markdown ordered lists keep markers inside the content box', async ({
  page,
}) => {
  await page.goto('/')

  const orderedList = page.locator('.terminal-entry--welcome .terminal-markdown ol').first()
  const firstItem = orderedList.locator('li').first()

  await expect(orderedList).toBeVisible()
  await expect(firstItem).toBeVisible()

  const listStylePosition = await orderedList.evaluate(
    (node) => window.getComputedStyle(node).listStylePosition
  )
  const itemPaddingLeft = await firstItem.evaluate(
    (node) => window.getComputedStyle(node).paddingLeft
  )
  const itemTextIndent = await firstItem.evaluate(
    (node) => window.getComputedStyle(node).textIndent
  )

  expect(listStylePosition).toBe('inside')
  expect(itemPaddingLeft).toBe('22.4px')
  expect(itemTextIndent).toBe('-22.4px')
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

  for (const command of ['about', 'birthday']) {
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

test('cat renders content files and handles usage and missing slugs', async ({
  page,
}) => {
  const expectedContentAssertions = {
    intro: 'Helpful navigation tips',
    'big-tech-vs-startups-the-myths-and-realities':
      'Should I join a startup or make myself comfortable at the Big Tech?',
  }

  await page.goto('/')

  for (const slug of Object.keys(expectedContentAssertions)) {
    await runCommand(page, `cat ${slug}`)
    await expect(page.getByTestId('terminal-entry').last()).toContainText(
      expectedContentAssertions[slug]
    )
  }

  await runCommand(page, 'cat')
  await expect(page.getByText('Usage: cat <slug>', { exact: false })).toBeVisible()

  await runCommand(page, 'cat wrong-slug')
  await expect(
    page.getByText('No content file found for wrong-slug.', { exact: false })
  ).toBeVisible()
})

test('writings links local content entries to content routes', async ({ page }) => {
  await page.goto('/')
  await runCommand(page, 'writings')

  const articleLink = page.getByRole('link', {
    name: 'Big Tech vs Startups: The myths and realities',
  })

  await expect(articleLink).toHaveAttribute(
    'href',
    '/big-tech-vs-startups-the-myths-and-realities'
  )

  await articleLink.click()

  await expect(page).toHaveURL(/\/big-tech-vs-startups-the-myths-and-realities$/)
  await expectPrompt(page, 'cat big-tech-vs-startups-the-myths-and-realities')
})

test('root reload shows the welcome panel again when browser persistence is disabled', async ({
  page,
}) => {
  await page.goto('/')
  await runCommand(page, 'about')

  await page.reload()

  await expect(
    page.getByText('Welcome to my corner on the internet', { exact: false })
  ).toBeVisible()
})

test('root commands render in-session before reload', async ({ page }) => {
  await page.goto('/')

  await runCommand(page, 'about')
  await runCommand(page, 'help')

  await expect(page.getByText(ABOUT_ASSERTION, { exact: false })).toBeVisible()
  await expect(page.getByText('Available Commands')).toBeVisible()
})

test('clear resets the root page back to the intro on reload', async ({
  page,
}) => {
  await page.goto('/')

  await runCommand(page, 'about')
  await runCommand(page, 'clear')
  await expect(page.getByTestId('terminal-entry')).toHaveCount(0)

  await page.reload()

  await expect(
    page.getByText('Welcome to my corner on the internet')
  ).toBeVisible()
  await expect(
    page.getByText('Helpful navigation tips', { exact: false })
  ).toBeVisible()
})

test('subroutes auto-run derived commands and ignore persisted root history', async ({
  page,
}) => {
  await page.goto('/')
  await runCommand(page, 'about')
  await runCommand(page, 'writings')

  await expect(page.getByText('Ares 3 on Substack', { exact: false })).toBeVisible()

  await page.goto('/about')

  await expectPrompt(page, 'about')
  await expect(page.getByText(ABOUT_ASSERTION, { exact: false })).toBeVisible()
  await expect(page.getByTestId('terminal-home-button')).toBeVisible()
  await expect(page.getByText('Ares 3 on Substack', { exact: false })).toHaveCount(0)
})

test('route-only home button returns the user to the root page', async ({ page }) => {
  await page.goto('/about')

  const homeButton = page.getByTestId('terminal-home-button')

  await expect(homeButton).toBeVisible()
  await homeButton.click()

  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByText('Welcome to my corner on the internet', { exact: false })
  ).toBeVisible()
  await expect(page.getByTestId('terminal-home-button')).toHaveCount(0)
})

test('nested subroutes auto-run the full token path and reset on reload', async ({
  page,
}) => {
  await page.goto('/birthday/2023')

  await expectPrompt(page, 'birthday 2023')
  await expect(page.getByText(BIRTHDAY_ASSERTION, { exact: false })).toBeVisible()

  await runCommand(page, 'about')
  await expect(page.getByText(ABOUT_ASSERTION, { exact: false })).toBeVisible()

  await page.reload()

  await expectPrompt(page, 'birthday 2023')
  await expect(page.getByText(BIRTHDAY_ASSERTION, { exact: false })).toBeVisible()
  await expect(page.getByText(ABOUT_ASSERTION, { exact: false })).toHaveCount(0)
})

test('subpage reload discards ad hoc history and restores only the route command', async ({
  page,
}) => {
  await page.goto('/about')

  await expectPrompt(page, 'about')
  await expect(page.getByText(ABOUT_ASSERTION, { exact: false })).toBeVisible()

  await runCommand(page, 'writings')
  await expect(page.getByText('Ares 3 on Substack', { exact: false })).toBeVisible()

  await page.reload()

  await expectPrompt(page, 'about')
  await expect(page.getByText(ABOUT_ASSERTION, { exact: false })).toBeVisible()
  await expect(page.getByText('Ares 3 on Substack', { exact: false })).toHaveCount(0)
})

test('content routes auto-run cat and reset on reload', async ({ page }) => {
  await page.goto('/big-tech-vs-startups-the-myths-and-realities')

  await expectPrompt(page, 'cat big-tech-vs-startups-the-myths-and-realities')
  await expect(
    page.getByText(
      'Should I join a startup or make myself comfortable at the Big Tech?',
      { exact: false }
    )
  ).toBeVisible()

  await runCommand(page, 'about')
  await expect(page.getByText(ABOUT_ASSERTION, { exact: false })).toBeVisible()

  await page.reload()

  await expectPrompt(page, 'cat big-tech-vs-startups-the-myths-and-realities')
  await expect(
    page.getByText(
      'Should I join a startup or make myself comfortable at the Big Tech?',
      { exact: false }
    )
  ).toBeVisible()
  await expect(page.getByText(ABOUT_ASSERTION, { exact: false })).toHaveCount(0)
})

test('content routes keep the initial viewport at the top for reading', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 720 })
  await page.goto('/big-tech-vs-startups-the-myths-and-realities')

  const scrollMetrics = await page.getByTestId('terminal-output').evaluate((node) => ({
    scrollTop: node.scrollTop,
    scrollHeight: node.scrollHeight,
    clientHeight: node.clientHeight,
  }))

  expect(scrollMetrics.scrollHeight).toBeGreaterThan(scrollMetrics.clientHeight)
  expect(scrollMetrics.scrollTop).toBeLessThanOrEqual(4)
})

test('invalid routes use the normal command-not-found output instead of a framework 404', async ({
  page,
}) => {
  await page.goto('/totally/made/up')

  await expectPrompt(page, 'totally made up')
  await expect(page.getByText('command not found', { exact: false })).toBeVisible()
  await expect(page.getByTestId('terminal-shell')).toBeVisible()
})

test('new terminal output scrolls to the bottom after each command', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 720 })
  await page.goto('/')

  for (let index = 0; index < 12; index += 1) {
    await runCommand(page, 'writings')
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

  await expect(page.getByText(ABOUT_ASSERTION, { exact: false })).toBeVisible()
  await expect(page.getByTestId('terminal-input')).toHaveValue('')
})

test('long input wraps inside the prompt without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 700, height: 720 })
  await page.goto('/')

  const input = page.getByTestId('terminal-input')
  const display = page.getByTestId('terminal-input-display')
  const longCommand =
    'cat sdklfsd fjsdkfj sdklf sdklf dsklfjsd klfjsdlf sdljf sdklfjsdl f jsdklfsdl fjsd fjsdklfj sdklfj sklfj sdlfjsdlfjsd'

  await input.fill(longCommand)
  await expect(input).toHaveValue(longCommand)

  const displayMetrics = await display.evaluate((node) => {
    const styles = window.getComputedStyle(node)
    const lineHeight = Number.parseFloat(styles.lineHeight)
    const fontSize = Number.parseFloat(styles.fontSize)

    return {
      clientWidth: node.clientWidth,
      scrollWidth: node.scrollWidth,
      clientHeight: node.clientHeight,
      lineHeight: Number.isNaN(lineHeight) ? fontSize * 1.4 : lineHeight,
    }
  })

  expect(displayMetrics.scrollWidth).toBeLessThanOrEqual(displayMetrics.clientWidth + 1)
  expect(displayMetrics.clientHeight).toBeGreaterThan(displayMetrics.lineHeight * 1.5)
})

test('Ctrl+W deletes the previous word and keeps the mirrored display in sync', async ({
  page,
}) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')
  const parentToken = page.getByTestId('terminal-input-parent-token')
  const suffix = page.getByTestId('terminal-input-suffix')

  await input.fill('birthday 2023')
  await input.press('Control+w')

  await expectMirroredInput(page, 'birthday ')
  await expect(parentToken).toHaveText('birthday')
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

  await input.fill('birthday 2023')
  await setInputSelection(input, 8)
  await input.press('Control+u')

  await expectMirroredInput(page, ' 2023')
  await expect(parentToken).toHaveText('2023')
  await expect(parentToken).not.toHaveClass(
    /terminal-input-parent-token--highlighted/
  )
})

test('Ctrl+W deletes the current selection', async ({ page }) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')

  await input.fill('birthday 2023')
  await setInputSelection(input, 9, 'birthday 2023'.length)
  await input.press('Control+w')

  await expectMirroredInput(page, 'birthday ')
})

test('Ctrl+U deletes from the start of the line to the selection end', async ({
  page,
}) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')

  await input.fill('birthday 2023')
  await setInputSelection(input, 9, 'birthday 2023'.length)
  await input.press('Control+u')

  await expectMirroredInput(page, '')
})

test('commands still submit normally after readline-style shortcut edits', async ({
  page,
}) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')

  await input.fill('birthday 2023')
  await input.press('Control+w')
  await input.type(' 2023')
  await input.press('Enter')

  await expect(page.getByText(BIRTHDAY_ASSERTION, { exact: false })).toBeVisible()
  await expect(input).toHaveValue('')
})

test('Ctrl+L clears the terminal like the clear command', async ({ page }) => {
  await page.goto('/')

  const input = page.getByTestId('terminal-input')

  await runCommand(page, 'about')
  await runCommand(page, 'help')
  await input.fill('birthday 2023')
  await input.press('Control+l')

  await expect(page.getByTestId('terminal-entry')).toHaveCount(0)
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

  for (const command of ['help', 'man', 'cat', 'about', 'contact', 'birthday']) {
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

  await input.fill('birthday 2023')
  await expect(parentToken).toHaveText('birthday')
  await expect(parentToken).toHaveClass(
    /terminal-input-parent-token--highlighted/
  )
  await expect(suffix).toHaveText(' 2023')

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

test('content slugs do not collide with command names', async () => {
  const builtins = readBuiltinFixtures(BUILTIN_COMMANDS_DIRECTORY)
  const { manualEntries, runnableCommands } = readCustomFixtures(CUSTOM_COMMANDS_DIRECTORY)
  const contentFixtures = readContentFixtures(CONTENT_DIRECTORY)
  const commandNames = new Set(
    [...builtins, ...manualEntries, ...runnableCommands].map((entry) => entry.name)
  )

  for (const contentEntry of contentFixtures) {
    expect(commandNames.has(contentEntry.name)).toBe(false)
  }
})

test.describe('responsive smoke', () => {
  test.use({
    viewport: { width: 390, height: 844 },
  })

  test('terminal shell remains usable on mobile', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('terminal-input')).toBeVisible()

    await runCommand(page, 'birthday 2023')

    await expect(page.getByText(BIRTHDAY_ASSERTION, { exact: false })).toBeVisible()
  })
})
