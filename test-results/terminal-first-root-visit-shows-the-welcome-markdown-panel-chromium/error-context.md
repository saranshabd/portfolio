# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: terminal.spec.js >> first root visit shows the welcome markdown panel
- Location: tests/e2e/terminal.spec.js:339:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Start with help to see what is installed')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Start with help to see what is installed')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - article [ref=e5]:
        - generic [ref=e6]:
          - heading "Welcome to my corner on the internet!" [level=1] [ref=e7]
          - paragraph [ref=e8]: I am a Software Engineer, assuming the role still exists, living in Bangalore, India. I have been working as a SWE for more than half a decade across finance, startups and sales-tech. These days I find myself exploring the tech-verse and trying to find my bearings.
          - paragraph [ref=e9]: I like to read, watch movies & TV shows and play PlayStation when I am not being an AI doomer. I exercise often, play sports and try to keep myself alive while trying this activity most often refer to as swimming. I like dark & edgy comedy. I am a passionate Real Madrid, Manchester United and Max Verstappen supporter. And yes, feel free to judge me on that last part.
          - heading "Why did I choose a terminal interface for this website? JUST BECAUSE." [level=1] [ref=e10]
          - separator [ref=e11]
          - paragraph [ref=e12]: "💡 Helpful navigation tips:"
          - list [ref=e13]:
            - listitem [ref=e14]:
              - text: Use the
              - code [ref=e15]: help
              - text: command to see what all you can do here.
            - listitem [ref=e16]:
              - text: Run
              - code [ref=e17]: man <command>
              - text: to inspect a command before executing it. And no, I am not a sexist, it's Unix inspired. "man" stands for "manual".
            - listitem [ref=e18]:
              - text: Run
              - code [ref=e19]: clear
              - text: for clearing the command history.
      - generic [ref=e21]:
        - generic [ref=e22]: internet@127.0.0.1:~$
        - textbox "internet@127.0.0.1:~$" [active] [ref=e24]
  - button "Open Next.js Dev Tools" [ref=e30] [cursor=pointer]:
    - img [ref=e31]
  - alert [ref=e34]
```

# Test source

```ts
  247 |   const display = page.getByTestId('terminal-input-display')
  248 |   const mirroredText = await display.evaluate((node) =>
  249 |     (node.textContent ?? '').replace(/\u00a0/gu, '')
  250 |   )
  251 | 
  252 |   await expect(input).toHaveValue(expectedValue)
  253 |   expect(mirroredText).toBe(expectedValue)
  254 | }
  255 | 
  256 | async function readTextColor(locator) {
  257 |   return locator.evaluate((node) => window.getComputedStyle(node).color)
  258 | }
  259 | 
  260 | async function readPersistedRootSession(page) {
  261 |   return page.evaluate(async () => {
  262 |     const DATABASE_NAME = 'terminal-portfolio'
  263 |     const STORE_NAME = 'shell'
  264 |     const ROOT_SESSION_KEY = 'root-session'
  265 | 
  266 |     return await new Promise((resolve, reject) => {
  267 |       const request = window.indexedDB.open(DATABASE_NAME, 2)
  268 | 
  269 |       request.onupgradeneeded = () => {
  270 |         const database = request.result
  271 | 
  272 |         if (!database.objectStoreNames.contains(STORE_NAME)) {
  273 |           database.createObjectStore(STORE_NAME)
  274 |         }
  275 |       }
  276 | 
  277 |       request.onsuccess = () => {
  278 |         const database = request.result
  279 |         const transaction = database.transaction(STORE_NAME, 'readonly')
  280 |         const store = transaction.objectStore(STORE_NAME)
  281 |         const getRequest = store.get(ROOT_SESSION_KEY)
  282 | 
  283 |         getRequest.onsuccess = () => {
  284 |           database.close()
  285 |           resolve(getRequest.result ?? null)
  286 |         }
  287 | 
  288 |         getRequest.onerror = () => {
  289 |           database.close()
  290 |           reject(getRequest.error)
  291 |         }
  292 |       }
  293 | 
  294 |       request.onerror = () => reject(request.error)
  295 |     })
  296 |   })
  297 | }
  298 | 
  299 | async function writeLegacySession(page, session) {
  300 |   await page.evaluate(async (nextSession) => {
  301 |     const DATABASE_NAME = 'terminal-portfolio'
  302 |     const STORE_NAME = 'shell'
  303 |     const LEGACY_SESSION_KEY = 'session'
  304 | 
  305 |     await new Promise((resolve, reject) => {
  306 |       const request = window.indexedDB.open(DATABASE_NAME, 2)
  307 | 
  308 |       request.onupgradeneeded = () => {
  309 |         const database = request.result
  310 | 
  311 |         if (!database.objectStoreNames.contains(STORE_NAME)) {
  312 |           database.createObjectStore(STORE_NAME)
  313 |         }
  314 |       }
  315 | 
  316 |       request.onsuccess = () => {
  317 |         const database = request.result
  318 |         const transaction = database.transaction(STORE_NAME, 'readwrite')
  319 |         const store = transaction.objectStore(STORE_NAME)
  320 | 
  321 |         transaction.oncomplete = () => {
  322 |           database.close()
  323 |           resolve()
  324 |         }
  325 | 
  326 |         transaction.onerror = () => {
  327 |           database.close()
  328 |           reject(transaction.error)
  329 |         }
  330 | 
  331 |         store.put(nextSession, LEGACY_SESSION_KEY)
  332 |       }
  333 | 
  334 |       request.onerror = () => reject(request.error)
  335 |     })
  336 |   }, session)
  337 | }
  338 | 
  339 | test('first root visit shows the welcome markdown panel', async ({ page }) => {
  340 |   await page.goto('/')
  341 | 
  342 |   await expect(
  343 |     page.getByText('Welcome to my corner on the internet')
  344 |   ).toBeVisible()
  345 |   await expect(
  346 |     page.getByText('Start with help to see what is installed', { exact: false })
> 347 |   ).toBeVisible()
      |     ^ Error: expect(locator).toBeVisible() failed
  348 | })
  349 | 
  350 | test('welcome markdown highlights inline command snippets', async ({ page }) => {
  351 |   await page.goto('/')
  352 | 
  353 |   const helpSnippet = page.locator('.terminal-markdown code', { hasText: 'help' })
  354 |   const manSnippet = page.locator('.terminal-markdown code', { hasText: 'man <command>' })
  355 |   const clearSnippet = page.locator('.terminal-markdown code', { hasText: 'clear' })
  356 | 
  357 |   await expect(helpSnippet).toBeVisible()
  358 |   await expect(manSnippet).toBeVisible()
  359 |   await expect(clearSnippet).toBeVisible()
  360 | })
  361 | 
  362 | test('welcome markdown ordered lists keep markers inside the content box', async ({
  363 |   page,
  364 | }) => {
  365 |   await page.goto('/')
  366 | 
  367 |   const orderedList = page.locator('.terminal-entry--welcome .terminal-markdown ol').first()
  368 |   const firstItem = orderedList.locator('li').first()
  369 | 
  370 |   await expect(orderedList).toBeVisible()
  371 |   await expect(firstItem).toBeVisible()
  372 | 
  373 |   const listStylePosition = await orderedList.evaluate(
  374 |     (node) => window.getComputedStyle(node).listStylePosition
  375 |   )
  376 |   const itemPaddingLeft = await firstItem.evaluate(
  377 |     (node) => window.getComputedStyle(node).paddingLeft
  378 |   )
  379 |   const itemTextIndent = await firstItem.evaluate(
  380 |     (node) => window.getComputedStyle(node).textIndent
  381 |   )
  382 | 
  383 |   expect(listStylePosition).toBe('inside')
  384 |   expect(itemPaddingLeft).toBe('22.4px')
  385 |   expect(itemTextIndent).toBe('-22.4px')
  386 | })
  387 | 
  388 | test('help lists built-ins and grouped custom commands', async ({ page }) => {
  389 |   const builtins = readBuiltinFixtures(BUILTIN_COMMANDS_DIRECTORY)
  390 |   const customFixtures = readCustomFixtures(CUSTOM_COMMANDS_DIRECTORY)
  391 |   const groupedHelpEntries = buildGroupedHelpEntries(
  392 |     customFixtures.runnableCommands,
  393 |     customFixtures.manualEntries
  394 |   )
  395 | 
  396 |   await page.goto('/')
  397 |   await runCommand(page, 'help')
  398 | 
  399 |   await expect(page.getByText('Available Commands')).toBeVisible()
  400 |   await expect(page.getByTestId('terminal-output')).toContainText('Built-ins')
  401 |   await expect(page.getByTestId('terminal-output')).toContainText('Custom')
  402 | 
  403 |   for (const builtin of builtins) {
  404 |     await expect(page.getByTestId('terminal-output')).toContainText(builtin.name)
  405 |   }
  406 | 
  407 |   for (const entry of groupedHelpEntries) {
  408 |     await expect(page.getByTestId('terminal-output')).toContainText(entry.label)
  409 | 
  410 |     if (entry.summary) {
  411 |       await expect(page.getByTestId('terminal-output')).toContainText(entry.summary)
  412 |     }
  413 |   }
  414 | })
  415 | 
  416 | test('custom commands render recursive markdown-backed output', async ({ page }) => {
  417 |   const { runnableCommands } = readCustomFixtures(CUSTOM_COMMANDS_DIRECTORY)
  418 | 
  419 |   await page.goto('/')
  420 | 
  421 |   for (const command of runnableCommands) {
  422 |     await runCommand(page, command.name)
  423 |     await expect(
  424 |       page.getByText(extractAssertionText(command.output), { exact: false })
  425 |     ).toBeVisible()
  426 |   }
  427 | })
  428 | 
  429 | test('built-in and directory-backed manuals are reachable through man', async ({
  430 |   page,
  431 | }) => {
  432 |   const builtins = readBuiltinFixtures(BUILTIN_COMMANDS_DIRECTORY)
  433 |   const { manualEntries } = readCustomFixtures(CUSTOM_COMMANDS_DIRECTORY)
  434 | 
  435 |   await page.goto('/')
  436 | 
  437 |   for (const builtin of builtins) {
  438 |     await runCommand(page, `man ${builtin.name}`)
  439 |     await expect(
  440 |       page.getByText(extractAssertionText(builtin.manual), { exact: false })
  441 |     ).toBeVisible()
  442 |   }
  443 | 
  444 |   for (const command of ['about', 'status', 'birthday']) {
  445 |     const manualEntry = manualEntries.find((entry) => entry.name === command)
  446 | 
  447 |     await runCommand(page, `man ${command}`)
```