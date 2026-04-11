# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: terminal.spec.js >> built-in and directory-backed manuals are reachable through man
- Location: tests/e2e/terminal.spec.js:429:1

# Error details

```
TypeError: Cannot read properties of undefined (reading 'manual')
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
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
        - article [ref=e20]:
          - paragraph [ref=e21]:
            - generic [ref=e22]: internet@127.0.0.1:~$
            - generic [ref=e23]: man clear
        - article [ref=e24]:
          - generic [ref=e25]:
            - heading "clear" [level=1] [ref=e26]
            - paragraph [ref=e27]: Clears the screen and the command history from your browser. Please note that it will not clear your browser history so you will have to do your own dirty work.
        - article [ref=e28]:
          - paragraph [ref=e29]:
            - generic [ref=e30]: internet@127.0.0.1:~$
            - generic [ref=e31]: man help
        - article [ref=e32]:
          - generic [ref=e33]:
            - heading "help" [level=1] [ref=e34]
            - paragraph [ref=e35]: Lists all the commands and subcommands in a helpful, orderly fashion. Useful for newcomers and noobs.
        - article [ref=e36]:
          - paragraph [ref=e37]:
            - generic [ref=e38]: internet@127.0.0.1:~$
            - generic [ref=e39]: man man
        - article [ref=e40]:
          - generic [ref=e41]:
            - heading "man" [level=1] [ref=e42]
            - paragraph [ref=e43]: Displays the content for any command, built-in or otherwise.
        - article [ref=e44]:
          - paragraph [ref=e45]:
            - generic [ref=e46]: internet@127.0.0.1:~$
            - generic [ref=e47]: man about
        - article [ref=e48]:
          - generic [ref=e49]:
            - heading "about" [level=1] [ref=e50]
            - paragraph [ref=e51]: A quick word about myself. Pun intended.
        - article [ref=e52]:
          - paragraph [ref=e53]:
            - generic [ref=e54]: internet@127.0.0.1:~$
            - generic [ref=e55]: man status
        - article [ref=e56]:
          - paragraph [ref=e58]:
            - text: No manual entry for
            - code [ref=e59]: status
            - text: . Run
            - code [ref=e60]: help
            - text: to inspect available commands.
      - generic [ref=e62]:
        - generic [ref=e63]: internet@127.0.0.1:~$
        - textbox "internet@127.0.0.1:~$" [active] [ref=e65]
  - button "Open Next.js Dev Tools" [ref=e71] [cursor=pointer]:
    - img [ref=e72]
  - alert [ref=e75]
```

# Test source

```ts
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
  448 |     await expect(
> 449 |       page.getByText(extractAssertionText(manualEntry.manual), { exact: false })
      |                                                       ^ TypeError: Cannot read properties of undefined (reading 'manual')
  450 |     ).toBeVisible()
  451 |   }
  452 | })
  453 | 
  454 | test('bare parents, invalid subcommands, and gibberish commands show shell-style errors', async ({
  455 |   page,
  456 | }) => {
  457 |   await page.goto('/')
  458 | 
  459 |   for (const invalidCommand of ['status', 'status nonsense', 'asdlkj']) {
  460 |     await runCommand(page, invalidCommand)
  461 |   }
  462 | 
  463 |   await expect(page.getByText('command not found', { exact: false })).toHaveCount(
  464 |     3
  465 |   )
  466 |   await expect(
  467 |     page.getByText('Run help to inspect available commands.', { exact: false })
  468 |   ).toHaveCount(3)
  469 | })
  470 | 
  471 | test('legacy root sessions still restore after the storage-key migration', async ({
  472 |   page,
  473 | }) => {
  474 |   await page.goto('/')
  475 | 
  476 |   await writeLegacySession(page, {
  477 |     initialized: true,
  478 |     entries: [
  479 |       {
  480 |         id: 'legacy-output',
  481 |         type: 'output',
  482 |         content: 'Legacy root session survives.',
  483 |       },
  484 |     ],
  485 |   })
  486 | 
  487 |   await page.reload()
  488 | 
  489 |   await expect(
  490 |     page.getByText('Legacy root session survives.', { exact: false })
  491 |   ).toBeVisible()
  492 | })
  493 | 
  494 | test('root history persists across reload', async ({ page }) => {
  495 |   await page.goto('/')
  496 | 
  497 |   await runCommand(page, 'about')
  498 |   await runCommand(page, 'help')
  499 | 
  500 |   await expect(
  501 |     page.getByText('I work as a software engineer', { exact: false })
  502 |   ).toBeVisible()
  503 | 
  504 |   await page.reload()
  505 | 
  506 |   await expect(
  507 |     page.getByText('I work as a software engineer', { exact: false })
  508 |   ).toBeVisible()
  509 |   await expect(page.getByText('Available Commands')).toBeVisible()
  510 | })
  511 | 
  512 | test('clear resets the root page back to the intro on reload', async ({
  513 |   page,
  514 | }) => {
  515 |   await page.goto('/')
  516 | 
  517 |   await runCommand(page, 'about')
  518 |   await runCommand(page, 'clear')
  519 |   await expect(page.getByTestId('terminal-entry')).toHaveCount(0)
  520 | 
  521 |   const persistedSession = await readPersistedRootSession(page)
  522 | 
  523 |   expect(persistedSession).toEqual({
  524 |     initialized: true,
  525 |     entries: [],
  526 |   })
  527 | 
  528 |   await page.reload()
  529 | 
  530 |   await expect(
  531 |     page.getByText('Welcome to my corner on the internet')
  532 |   ).toBeVisible()
  533 |   await expect(
  534 |     page.getByText('Start with help to see what is installed', { exact: false })
  535 |   ).toBeVisible()
  536 | })
  537 | 
  538 | test('subroutes auto-run derived commands and ignore persisted root history', async ({
  539 |   page,
  540 | }) => {
  541 |   await page.goto('/')
  542 |   await runCommand(page, 'about')
  543 |   await runCommand(page, 'writing')
  544 | 
  545 |   await expect(page.getByText('Ares 3 on Substack', { exact: false })).toBeVisible()
  546 | 
  547 |   await page.goto('/about')
  548 | 
  549 |   await expect(
```