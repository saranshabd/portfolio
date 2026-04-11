# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: terminal.spec.js >> invalid routes use the normal command-not-found output instead of a framework 404
- Location: tests/e2e/terminal.spec.js:614:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('shabd@portfolio:~$ totally made up')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('shabd@portfolio:~$ totally made up')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - article [ref=e5]:
          - paragraph [ref=e6]:
            - generic [ref=e7]: internet@127.0.0.1:~$
            - generic [ref=e8]: totally made up
        - article [ref=e9]:
          - generic [ref=e10]:
            - paragraph [ref=e11]:
              - code [ref=e12]: totally made up
              - text: ": command not found"
            - paragraph [ref=e13]:
              - text: Run
              - code [ref=e14]: help
              - text: to inspect available commands.
      - generic [ref=e16]:
        - generic [ref=e17]: internet@127.0.0.1:~$
        - textbox "internet@127.0.0.1:~$" [active] [ref=e19]
  - button "Open Next.js Dev Tools" [ref=e25] [cursor=pointer]:
    - img [ref=e26]
  - alert [ref=e29]
```

# Test source

```ts
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
> 621 |   ).toBeVisible()
      |     ^ Error: expect(locator).toBeVisible() failed
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
  660 |   ).toBeVisible()
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
```