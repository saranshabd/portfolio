# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: terminal.spec.js >> responsive smoke >> terminal shell remains usable on mobile
- Location: tests/e2e/terminal.spec.js:735:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('terminal-input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('terminal-input')

```

# Test source

```ts
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
  686 |   const display = page.getByTestId('terminal-input-display')
  687 | 
  688 |   for (const command of ['help', 'man', 'about', 'status', 'birthday']) {
  689 |     await input.fill(command)
  690 |     await expect(parentToken).toHaveText(command)
  691 |     await expect(parentToken).toHaveClass(
  692 |       /terminal-input-parent-token--highlighted/
  693 |     )
  694 |   }
  695 | 
  696 |   await input.fill('asdlkj')
  697 |   await expect(parentToken).toHaveText('asdlkj')
  698 |   await expect(parentToken).not.toHaveClass(
  699 |     /terminal-input-parent-token--highlighted/
  700 |   )
  701 | 
  702 |   await input.fill('sta')
  703 |   await expect(parentToken).toHaveText('sta')
  704 |   await expect(parentToken).not.toHaveClass(
  705 |     /terminal-input-parent-token--highlighted/
  706 |   )
  707 | 
  708 |   await input.fill('status professional')
  709 |   await expect(parentToken).toHaveText('status')
  710 |   await expect(parentToken).toHaveClass(
  711 |     /terminal-input-parent-token--highlighted/
  712 |   )
  713 |   await expect(suffix).toHaveText(' professional')
  714 | 
  715 |   await input.fill('birthday 2023')
  716 |   await expect(parentToken).toHaveText('birthday')
  717 |   await expect(parentToken).toHaveClass(
  718 |     /terminal-input-parent-token--highlighted/
  719 |   )
  720 |   await expect(suffix).toHaveText(' 2023')
  721 | 
  722 |   const parentColor = await readTextColor(parentToken)
  723 |   const suffixColor = await readTextColor(suffix)
  724 |   const displayColor = await readTextColor(display)
  725 | 
  726 |   expect(parentColor).not.toBe(displayColor)
  727 |   expect(suffixColor).toBe(displayColor)
  728 | })
  729 | 
  730 | test.describe('responsive smoke', () => {
  731 |   test.use({
  732 |     viewport: { width: 390, height: 844 },
  733 |   })
  734 | 
  735 |   test('terminal shell remains usable on mobile', async ({ page }) => {
  736 |     await page.goto('/')
  737 | 
> 738 |     await expect(page.getByTestId('terminal-input')).toBeVisible()
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  739 | 
  740 |     await runCommand(page, 'status professional')
  741 | 
  742 |     await expect(page.getByText('Bengaluru, India', { exact: false })).toBeVisible()
  743 |   })
  744 | })
  745 | 
```