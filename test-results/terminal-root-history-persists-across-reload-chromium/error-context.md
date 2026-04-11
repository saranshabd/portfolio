# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: terminal.spec.js >> root history persists across reload
- Location: tests/e2e/terminal.spec.js:494:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('I work as a software engineer')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('I work as a software engineer')

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
            - generic [ref=e23]: about
        - article [ref=e24]:
          - generic [ref=e25]:
            - paragraph [ref=e26]: I was the founding engineer at Sensei, a Sutter-Hill Venture backed startup, for a couple of years before it shut down in March 2026. We were building an AI-enabled sales-tech platform for the modern sales reps. I did all kinds of work at Sensei, ranging from building a real-time engine for processing audio and transcripts really fast, working on a knowledge graph for AI systems, writing client-side React, and the best of all, writing a C++ integration of our system with Zoom to pull AV in real-time from meetings. Sensei was a fun ride.
            - paragraph [ref=e27]: Before Sensei, I was a SWE at smallcase, a Series-C fintech startup in India. I was part of the team that built Loan Against Mutual Funds (LAMF) and helped the team scale it from 0-1. I wrote a bunch of JavaScript and a lot of Golang while I was there. Smallcase gave me a taste of what a real company looks like.
            - paragraph [ref=e28]: I started my journey in technology with Swadesh, which was a YC-backed startup building a neo-bank for Indian expats in The US. I joined Swadesh as a founding engineer and got to work on amazing problems and understand what starting a company looks like from the inside, compared to hearing about it from the sidelines.
            - paragraph [ref=e29]: Ultimately, I am always curious about what's going to happen next and don't hold much value to my current skillset. Vibe-coding is the new kid around the block these days so why not give it a shot? At the end of the day, one of my core believes is to build and create with whatever tools you have at your disposal.
        - article [ref=e30]:
          - paragraph [ref=e31]:
            - generic [ref=e32]: internet@127.0.0.1:~$
            - generic [ref=e33]: help
        - article [ref=e34]:
          - generic [ref=e35]:
            - heading "Available Commands" [level=1] [ref=e36]
            - heading "Built-ins" [level=2] [ref=e37]
            - list [ref=e38]:
              - listitem [ref=e39]:
                - code [ref=e40]: clear
                - text: "- Clears the screen and the command history from your browser. Please note that it will not clear your browser history so you will have to do your own dirty work."
              - listitem [ref=e41]:
                - code [ref=e42]: help
                - text: "- Lists all the commands and subcommands in a helpful, orderly fashion. Useful for newcomers and noobs."
              - listitem [ref=e43]:
                - code [ref=e44]: man
                - text: "- Displays the content for any command, built-in or otherwise."
            - heading "Custom" [level=2] [ref=e45]
            - list [ref=e46]:
              - listitem [ref=e47]:
                - code [ref=e48]: about
                - text: "- A quick word about myself. Pun intended."
              - listitem [ref=e49]:
                - code [ref=e50]: "birthday {2023}"
                - text: "- Inspect the birthday entries available in the terminal."
              - listitem [ref=e51]:
                - code [ref=e52]: contact
                - text: "- Shows how to reach out to me if you are interested for a quick chat."
              - listitem [ref=e53]:
                - code [ref=e54]: healthcheck
                - text: "- In case you are curious about my wellbeing."
              - listitem [ref=e55]:
                - code [ref=e56]: writing
                - text: "- List selected essays, technical posts, and exploration notes."
            - paragraph [ref=e57]:
              - text: Use
              - code [ref=e58]: man <command>
              - text: to inspect any command before you run it.
      - generic [ref=e60]:
        - generic [ref=e61]: internet@127.0.0.1:~$
        - textbox "internet@127.0.0.1:~$" [active] [ref=e63]
  - button "Open Next.js Dev Tools" [ref=e69] [cursor=pointer]:
    - img [ref=e70]
  - alert [ref=e73]
```

# Test source

```ts
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
  449 |       page.getByText(extractAssertionText(manualEntry.manual), { exact: false })
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
> 502 |   ).toBeVisible()
      |     ^ Error: expect(locator).toBeVisible() failed
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
  550 |     page.getByText('shabd@portfolio:~$ about', { exact: false })
  551 |   ).toBeVisible()
  552 |   await expect(
  553 |     page.getByText('I work as a software engineer', { exact: false })
  554 |   ).toBeVisible()
  555 |   await expect(page.getByText('Ares 3 on Substack', { exact: false })).toHaveCount(0)
  556 | })
  557 | 
  558 | test('nested subroutes auto-run the full token path and reset on reload', async ({
  559 |   page,
  560 | }) => {
  561 |   await page.goto('/birthday/2023')
  562 | 
  563 |   await expect(
  564 |     page.getByText('shabd@portfolio:~$ birthday 2023', { exact: false })
  565 |   ).toBeVisible()
  566 |   await expect(
  567 |     page.getByText('2023 was quieter than expected', { exact: false })
  568 |   ).toBeVisible()
  569 | 
  570 |   await runCommand(page, 'about')
  571 |   await expect(
  572 |     page.getByText('I work as a software engineer', { exact: false })
  573 |   ).toBeVisible()
  574 | 
  575 |   await page.reload()
  576 | 
  577 |   await expect(
  578 |     page.getByText('shabd@portfolio:~$ birthday 2023', { exact: false })
  579 |   ).toBeVisible()
  580 |   await expect(
  581 |     page.getByText('2023 was quieter than expected', { exact: false })
  582 |   ).toBeVisible()
  583 |   await expect(
  584 |     page.getByText('I work as a software engineer', { exact: false })
  585 |   ).toHaveCount(0)
  586 | })
  587 | 
  588 | test('subpage reload discards ad hoc history and restores only the route command', async ({
  589 |   page,
  590 | }) => {
  591 |   await page.goto('/about')
  592 | 
  593 |   await expect(
  594 |     page.getByText('shabd@portfolio:~$ about', { exact: false })
  595 |   ).toBeVisible()
  596 |   await expect(
  597 |     page.getByText('I work as a software engineer', { exact: false })
  598 |   ).toBeVisible()
  599 | 
  600 |   await runCommand(page, 'writing')
  601 |   await expect(page.getByText('Ares 3 on Substack', { exact: false })).toBeVisible()
  602 | 
```