# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: terminal.spec.js >> typing after clicking terminal content still targets the input
- Location: tests/e2e/terminal.spec.js:649:1

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
      - generic [ref=e31]:
        - generic [ref=e32]: internet@127.0.0.1:~$
        - textbox "internet@127.0.0.1:~$" [active] [ref=e34]
  - button "Open Next.js Dev Tools" [ref=e40] [cursor=pointer]:
    - img [ref=e41]
  - alert [ref=e44]
```

# Test source

```ts
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
  603 |   await page.reload()
  604 | 
  605 |   await expect(
  606 |     page.getByText('shabd@portfolio:~$ about', { exact: false })
  607 |   ).toBeVisible()
  608 |   await expect(
  609 |     page.getByText('I work as a software engineer', { exact: false })
  610 |   ).toBeVisible()
  611 |   await expect(page.getByText('Ares 3 on Substack', { exact: false })).toHaveCount(0)
  612 | })
  613 | 
  614 | test('invalid routes use the normal command-not-found output instead of a framework 404', async ({
  615 |   page,
  616 | }) => {
  617 |   await page.goto('/totally/made/up')
  618 | 
  619 |   await expect(
  620 |     page.getByText('shabd@portfolio:~$ totally made up', { exact: false })
  621 |   ).toBeVisible()
  622 |   await expect(page.getByText('command not found', { exact: false })).toBeVisible()
  623 |   await expect(page.getByTestId('terminal-shell')).toBeVisible()
  624 | })
  625 | 
  626 | test('new terminal output scrolls to the bottom after each command', async ({
  627 |   page,
  628 | }) => {
  629 |   await page.setViewportSize({ width: 1100, height: 720 })
  630 |   await page.goto('/')
  631 | 
  632 |   for (let index = 0; index < 12; index += 1) {
  633 |     await runCommand(page, 'writing')
  634 |   }
  635 | 
  636 |   await expect(page.getByTestId('terminal-input-bar')).toBeInViewport()
  637 | 
  638 |   const scrollMetrics = await page.getByTestId('terminal-output').evaluate((node) => ({
  639 |     clientHeight: node.clientHeight,
  640 |     scrollHeight: node.scrollHeight,
  641 |     scrollTop: node.scrollTop,
  642 |   }))
  643 | 
  644 |   expect(scrollMetrics.scrollTop + scrollMetrics.clientHeight).toBeGreaterThanOrEqual(
  645 |     scrollMetrics.scrollHeight - 4
  646 |   )
  647 | })
  648 | 
  649 | test('typing after clicking terminal content still targets the input', async ({
  650 |   page,
  651 | }) => {
  652 |   await page.goto('/')
  653 | 
  654 |   await page.getByText('Welcome to my corner on the internet').click()
  655 |   await page.keyboard.type('about')
  656 |   await page.keyboard.press('Enter')
  657 | 
  658 |   await expect(
  659 |     page.getByText('I work as a software engineer', { exact: false })
> 660 |   ).toBeVisible()
      |     ^ Error: expect(locator).toBeVisible() failed
  661 |   await expect(page.getByTestId('terminal-input')).toHaveValue('')
  662 | })
  663 | 
  664 | test('Ctrl+W deletes the previous word and keeps the mirrored display in sync', async ({
  665 |   page,
  666 | }) => {
  667 |   await page.goto('/')
  668 | 
  669 |   const input = page.getByTestId('terminal-input')
  670 |   const parentToken = page.getByTestId('terminal-input-parent-token')
  671 |   const suffix = page.getByTestId('terminal-input-suffix')
  672 | 
  673 |   await input.fill('status professional')
  674 |   await input.press('Control+w')
  675 | 
  676 |   await expectMirroredInput(page, 'status ')
  677 |   await expect(parentToken).toHaveText('status')
  678 |   await expect(parentToken).toHaveClass(
  679 |     /terminal-input-parent-token--highlighted/
  680 |   )
  681 |   await expect(suffix).toHaveText(' ')
  682 | })
  683 | 
  684 | test('Ctrl+U deletes to the caret and keeps the mirrored display in sync', async ({
  685 |   page,
  686 | }) => {
  687 |   await page.goto('/')
  688 | 
  689 |   const input = page.getByTestId('terminal-input')
  690 |   const parentToken = page.getByTestId('terminal-input-parent-token')
  691 | 
  692 |   await input.fill('status professional')
  693 |   await setInputSelection(input, 6)
  694 |   await input.press('Control+u')
  695 | 
  696 |   await expectMirroredInput(page, ' professional')
  697 |   await expect(parentToken).toHaveText('professional')
  698 |   await expect(parentToken).not.toHaveClass(
  699 |     /terminal-input-parent-token--highlighted/
  700 |   )
  701 | })
  702 | 
  703 | test('Ctrl+W deletes the current selection', async ({ page }) => {
  704 |   await page.goto('/')
  705 | 
  706 |   const input = page.getByTestId('terminal-input')
  707 | 
  708 |   await input.fill('status professional')
  709 |   await setInputSelection(input, 7, 'status professional'.length)
  710 |   await input.press('Control+w')
  711 | 
  712 |   await expectMirroredInput(page, 'status ')
  713 | })
  714 | 
  715 | test('Ctrl+U deletes from the start of the line to the selection end', async ({
  716 |   page,
  717 | }) => {
  718 |   await page.goto('/')
  719 | 
  720 |   const input = page.getByTestId('terminal-input')
  721 | 
  722 |   await input.fill('status professional')
  723 |   await setInputSelection(input, 7, 'status professional'.length)
  724 |   await input.press('Control+u')
  725 | 
  726 |   await expectMirroredInput(page, '')
  727 | })
  728 | 
  729 | test('commands still submit normally after readline-style shortcut edits', async ({
  730 |   page,
  731 | }) => {
  732 |   await page.goto('/')
  733 | 
  734 |   const input = page.getByTestId('terminal-input')
  735 | 
  736 |   await input.fill('status professional')
  737 |   await input.press('Control+w')
  738 |   await input.type(' professional')
  739 |   await input.press('Enter')
  740 | 
  741 |   await expect(
  742 |     page.getByText('Bengaluru, India', { exact: false })
  743 |   ).toBeVisible()
  744 |   await expect(input).toHaveValue('')
  745 | })
  746 | 
  747 | test('Ctrl+L clears the terminal like the clear command', async ({ page }) => {
  748 |   await page.goto('/')
  749 | 
  750 |   const input = page.getByTestId('terminal-input')
  751 | 
  752 |   await runCommand(page, 'about')
  753 |   await runCommand(page, 'help')
  754 |   await input.fill('status professional')
  755 |   await input.press('Control+l')
  756 | 
  757 |   await expect(page.getByTestId('terminal-entry')).toHaveCount(0)
  758 |   await expect(input).toHaveValue('')
  759 | 
  760 |   const persistedSession = await readPersistedRootSession(page)
```