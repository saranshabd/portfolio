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

function readCommandFixtures(directory) {
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
      }
    })
}

async function runCommand(page, command) {
  const input = page.getByTestId('terminal-input')
  await input.fill(command)
  await input.press('Enter')
}

async function readPersistedSession(page) {
  return page.evaluate(async () => {
    const DATABASE_NAME = 'terminal-portfolio'
    const STORE_NAME = 'shell'
    const SESSION_KEY = 'session'

    return await new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DATABASE_NAME, 1)

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
        const getRequest = store.get(SESSION_KEY)

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

test('first visit shows the welcome markdown panel', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByText('Welcome to my corner on the internet')
  ).toBeVisible()
  await expect(
    page.getByText('Start with help to see what is installed', { exact: false })
  ).toBeVisible()
})

test('help lists built-ins and all custom commands', async ({ page }) => {
  const customCommands = readCommandFixtures(CUSTOM_COMMANDS_DIRECTORY)

  await page.goto('/')
  await runCommand(page, 'help')

  await expect(page.getByText('Available Commands')).toBeVisible()
  await expect(page.getByTestId('terminal-output')).toContainText('Built-ins')
  await expect(page.getByTestId('terminal-output')).toContainText('Custom')

  for (const builtin of ['help', 'man', 'clear']) {
    await expect(page.getByTestId('terminal-output')).toContainText(builtin)
  }

  for (const customCommand of customCommands) {
    await expect(page.getByTestId('terminal-output')).toContainText(
      customCommand.name
    )
  }
})

test('custom commands render their markdown-backed output', async ({ page }) => {
  const customCommands = readCommandFixtures(CUSTOM_COMMANDS_DIRECTORY)

  await page.goto('/')

  for (const command of customCommands) {
    await runCommand(page, command.name)
    await expect(
      page.getByText(extractAssertionText(command.output), { exact: false })
    ).toBeVisible()
  }
})

test('built-in docs are reachable through man', async ({ page }) => {
  const builtins = readCommandFixtures(BUILTIN_COMMANDS_DIRECTORY)

  await page.goto('/')

  for (const builtin of builtins) {
    await runCommand(page, `man ${builtin.name}`)
    await expect(
      page.getByText(extractAssertionText(builtin.manual), { exact: false })
    ).toBeVisible()
  }
})

test('unknown commands show the shell-style error and help hint', async ({
  page,
}) => {
  await page.goto('/')

  for (const gibberish of ['asdlkj', 'plugh', 'zzzz123']) {
    await runCommand(page, gibberish)
  }

  await expect(page.getByText('command not found', { exact: false })).toHaveCount(
    3
  )
  await expect(
    page.getByText('Run help to inspect available commands.', { exact: false })
  ).toHaveCount(3)
})

test('history persists across reload and clear blanks the terminal persistently', async ({
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

  const persistedSession = await readPersistedSession(page)

  expect(persistedSession).toEqual({
    initialized: true,
    entries: [],
  })

  await page.reload()

  await expect(
    page.getByText('Welcome to my corner on the internet')
  ).toBeVisible()
  await expect(
    page.getByText('Start with help to see what is installed', { exact: false })
  ).toBeVisible()
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

test.describe('responsive smoke', () => {
  test.use({
    viewport: { width: 390, height: 844 },
  })

  test('terminal shell remains usable on mobile', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('terminal-input')).toBeVisible()

    await runCommand(page, 'status')

    await expect(page.getByText('Bengaluru, India', { exact: false })).toBeVisible()
  })
})
