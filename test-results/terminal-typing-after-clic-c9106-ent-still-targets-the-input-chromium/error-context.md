# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: terminal.spec.js >> typing after clicking terminal content still targets the input
- Location: tests/e2e/terminal.spec.js:580:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByText('Welcome to my corner on the internet')

```

# Test source

```ts
  485 |   await page.reload()
  486 | 
  487 |   await expect(
  488 |     page.getByText('Welcome to my corner on the internet')
  489 |   ).toBeVisible()
  490 |   await expect(
  491 |     page.getByText('Start with help to see what is installed', { exact: false })
  492 |   ).toBeVisible()
  493 | })
  494 | 
  495 | test('subroutes auto-run derived commands and ignore persisted root history', async ({
  496 |   page,
  497 | }) => {
  498 |   await page.goto('/')
  499 |   await runCommand(page, 'about')
  500 |   await runCommand(page, 'writing')
  501 | 
  502 |   await expect(page.getByText('Ares 3 on Substack', { exact: false })).toBeVisible()
  503 | 
  504 |   await page.goto('/about')
  505 | 
  506 |   await expect(
  507 |     page.getByText('shabd@portfolio:~$ about', { exact: false })
  508 |   ).toBeVisible()
  509 |   await expect(
  510 |     page.getByText('I work as a software engineer', { exact: false })
  511 |   ).toBeVisible()
  512 |   await expect(page.getByText('Ares 3 on Substack', { exact: false })).toHaveCount(0)
  513 | })
  514 | 
  515 | test('nested subroutes auto-run the full token path and reset on reload', async ({
  516 |   page,
  517 | }) => {
  518 |   await page.goto('/birthday/2023')
  519 | 
  520 |   await expect(
  521 |     page.getByText('shabd@portfolio:~$ birthday 2023', { exact: false })
  522 |   ).toBeVisible()
  523 |   await expect(
  524 |     page.getByText('2023 was quieter than expected', { exact: false })
  525 |   ).toBeVisible()
  526 | 
  527 |   await runCommand(page, 'about')
  528 |   await expect(
  529 |     page.getByText('I work as a software engineer', { exact: false })
  530 |   ).toBeVisible()
  531 | 
  532 |   await page.reload()
  533 | 
  534 |   await expect(
  535 |     page.getByText('shabd@portfolio:~$ birthday 2023', { exact: false })
  536 |   ).toBeVisible()
  537 |   await expect(
  538 |     page.getByText('2023 was quieter than expected', { exact: false })
  539 |   ).toBeVisible()
  540 |   await expect(
  541 |     page.getByText('I work as a software engineer', { exact: false })
  542 |   ).toHaveCount(0)
  543 | })
  544 | 
  545 | test('invalid routes use the normal command-not-found output instead of a framework 404', async ({
  546 |   page,
  547 | }) => {
  548 |   await page.goto('/totally/made/up')
  549 | 
  550 |   await expect(
  551 |     page.getByText('shabd@portfolio:~$ totally made up', { exact: false })
  552 |   ).toBeVisible()
  553 |   await expect(page.getByText('command not found', { exact: false })).toBeVisible()
  554 |   await expect(page.getByTestId('terminal-shell')).toBeVisible()
  555 | })
  556 | 
  557 | test('new terminal output scrolls to the bottom after each command', async ({
  558 |   page,
  559 | }) => {
  560 |   await page.setViewportSize({ width: 1100, height: 720 })
  561 |   await page.goto('/')
  562 | 
  563 |   for (let index = 0; index < 12; index += 1) {
  564 |     await runCommand(page, 'writing')
  565 |   }
  566 | 
  567 |   await expect(page.getByTestId('terminal-input-bar')).toBeInViewport()
  568 | 
  569 |   const scrollMetrics = await page.getByTestId('terminal-output').evaluate((node) => ({
  570 |     clientHeight: node.clientHeight,
  571 |     scrollHeight: node.scrollHeight,
  572 |     scrollTop: node.scrollTop,
  573 |   }))
  574 | 
  575 |   expect(scrollMetrics.scrollTop + scrollMetrics.clientHeight).toBeGreaterThanOrEqual(
  576 |     scrollMetrics.scrollHeight - 4
  577 |   )
  578 | })
  579 | 
  580 | test('typing after clicking terminal content still targets the input', async ({
  581 |   page,
  582 | }) => {
  583 |   await page.goto('/')
  584 | 
> 585 |   await page.getByText('Welcome to my corner on the internet').click()
      |                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  586 |   await page.keyboard.type('about')
  587 |   await page.keyboard.press('Enter')
  588 | 
  589 |   await expect(
  590 |     page.getByText('I work as a software engineer', { exact: false })
  591 |   ).toBeVisible()
  592 |   await expect(page.getByTestId('terminal-input')).toHaveValue('')
  593 | })
  594 | 
  595 | test('Ctrl+W deletes the previous word and keeps the mirrored display in sync', async ({
  596 |   page,
  597 | }) => {
  598 |   await page.goto('/')
  599 | 
  600 |   const input = page.getByTestId('terminal-input')
  601 |   const parentToken = page.getByTestId('terminal-input-parent-token')
  602 |   const suffix = page.getByTestId('terminal-input-suffix')
  603 | 
  604 |   await input.fill('status professional')
  605 |   await input.press('Control+w')
  606 | 
  607 |   await expectMirroredInput(page, 'status ')
  608 |   await expect(parentToken).toHaveText('status')
  609 |   await expect(parentToken).toHaveClass(
  610 |     /terminal-input-parent-token--highlighted/
  611 |   )
  612 |   await expect(suffix).toHaveText(' ')
  613 | })
  614 | 
  615 | test('Ctrl+U deletes to the caret and keeps the mirrored display in sync', async ({
  616 |   page,
  617 | }) => {
  618 |   await page.goto('/')
  619 | 
  620 |   const input = page.getByTestId('terminal-input')
  621 |   const parentToken = page.getByTestId('terminal-input-parent-token')
  622 | 
  623 |   await input.fill('status professional')
  624 |   await setInputSelection(input, 6)
  625 |   await input.press('Control+u')
  626 | 
  627 |   await expectMirroredInput(page, ' professional')
  628 |   await expect(parentToken).toHaveText('professional')
  629 |   await expect(parentToken).not.toHaveClass(
  630 |     /terminal-input-parent-token--highlighted/
  631 |   )
  632 | })
  633 | 
  634 | test('Ctrl+W deletes the current selection', async ({ page }) => {
  635 |   await page.goto('/')
  636 | 
  637 |   const input = page.getByTestId('terminal-input')
  638 | 
  639 |   await input.fill('status professional')
  640 |   await setInputSelection(input, 7, 'status professional'.length)
  641 |   await input.press('Control+w')
  642 | 
  643 |   await expectMirroredInput(page, 'status ')
  644 | })
  645 | 
  646 | test('Ctrl+U deletes from the start of the line to the selection end', async ({
  647 |   page,
  648 | }) => {
  649 |   await page.goto('/')
  650 | 
  651 |   const input = page.getByTestId('terminal-input')
  652 | 
  653 |   await input.fill('status professional')
  654 |   await setInputSelection(input, 7, 'status professional'.length)
  655 |   await input.press('Control+u')
  656 | 
  657 |   await expectMirroredInput(page, '')
  658 | })
  659 | 
  660 | test('commands still submit normally after readline-style shortcut edits', async ({
  661 |   page,
  662 | }) => {
  663 |   await page.goto('/')
  664 | 
  665 |   const input = page.getByTestId('terminal-input')
  666 | 
  667 |   await input.fill('status professional')
  668 |   await input.press('Control+w')
  669 |   await input.type(' professional')
  670 |   await input.press('Enter')
  671 | 
  672 |   await expect(
  673 |     page.getByText('Bengaluru, India', { exact: false })
  674 |   ).toBeVisible()
  675 |   await expect(input).toHaveValue('')
  676 | })
  677 | 
  678 | test('recognized parent commands highlight only the first input token', async ({
  679 |   page,
  680 | }) => {
  681 |   await page.goto('/')
  682 | 
  683 |   const input = page.getByTestId('terminal-input')
  684 |   const parentToken = page.getByTestId('terminal-input-parent-token')
  685 |   const suffix = page.getByTestId('terminal-input-suffix')
```