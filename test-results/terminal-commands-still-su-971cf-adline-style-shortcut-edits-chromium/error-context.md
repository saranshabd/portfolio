# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: terminal.spec.js >> commands still submit normally after readline-style shortcut edits
- Location: tests/e2e/terminal.spec.js:729:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Bengaluru, India')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Bengaluru, India')

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
            - generic [ref=e23]: status professional
        - article [ref=e24]:
          - generic [ref=e25]:
            - paragraph [ref=e26]:
              - code [ref=e27]: status professional
              - text: ": command not found"
            - paragraph [ref=e28]:
              - text: Run
              - code [ref=e29]: help
              - text: to inspect available commands.
      - generic [ref=e31]:
        - generic [ref=e32]: internet@127.0.0.1:~$
        - textbox "internet@127.0.0.1:~$" [active] [ref=e34]
  - button "Open Next.js Dev Tools" [ref=e40] [cursor=pointer]:
    - img [ref=e41]
  - alert [ref=e44]
```

# Test source

```ts
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
> 743 |   ).toBeVisible()
      |     ^ Error: expect(locator).toBeVisible() failed
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
  761 | 
  762 |   expect(persistedSession).toEqual({
  763 |     initialized: true,
  764 |     entries: [],
  765 |   })
  766 | })
  767 | 
  768 | test('recognized parent commands highlight only the first input token', async ({
  769 |   page,
  770 | }) => {
  771 |   await page.goto('/')
  772 | 
  773 |   const input = page.getByTestId('terminal-input')
  774 |   const parentToken = page.getByTestId('terminal-input-parent-token')
  775 |   const suffix = page.getByTestId('terminal-input-suffix')
  776 |   const display = page.getByTestId('terminal-input-display')
  777 | 
  778 |   for (const command of ['help', 'man', 'about', 'status', 'birthday']) {
  779 |     await input.fill(command)
  780 |     await expect(parentToken).toHaveText(command)
  781 |     await expect(parentToken).toHaveClass(
  782 |       /terminal-input-parent-token--highlighted/
  783 |     )
  784 |   }
  785 | 
  786 |   await input.fill('asdlkj')
  787 |   await expect(parentToken).toHaveText('asdlkj')
  788 |   await expect(parentToken).not.toHaveClass(
  789 |     /terminal-input-parent-token--highlighted/
  790 |   )
  791 | 
  792 |   await input.fill('sta')
  793 |   await expect(parentToken).toHaveText('sta')
  794 |   await expect(parentToken).not.toHaveClass(
  795 |     /terminal-input-parent-token--highlighted/
  796 |   )
  797 | 
  798 |   await input.fill('status professional')
  799 |   await expect(parentToken).toHaveText('status')
  800 |   await expect(parentToken).toHaveClass(
  801 |     /terminal-input-parent-token--highlighted/
  802 |   )
  803 |   await expect(suffix).toHaveText(' professional')
  804 | 
  805 |   await input.fill('birthday 2023')
  806 |   await expect(parentToken).toHaveText('birthday')
  807 |   await expect(parentToken).toHaveClass(
  808 |     /terminal-input-parent-token--highlighted/
  809 |   )
  810 |   await expect(suffix).toHaveText(' 2023')
  811 | 
  812 |   const parentColor = await readTextColor(parentToken)
  813 |   const suffixColor = await readTextColor(suffix)
  814 |   const displayColor = await readTextColor(display)
  815 | 
  816 |   expect(parentColor).not.toBe(displayColor)
  817 |   expect(suffixColor).toBe(displayColor)
  818 | })
  819 | 
  820 | test.describe('responsive smoke', () => {
  821 |   test.use({
  822 |     viewport: { width: 390, height: 844 },
  823 |   })
  824 | 
  825 |   test('terminal shell remains usable on mobile', async ({ page }) => {
  826 |     await page.goto('/')
  827 | 
  828 |     await expect(page.getByTestId('terminal-input')).toBeVisible()
  829 | 
  830 |     await runCommand(page, 'status professional')
  831 | 
  832 |     await expect(page.getByText('Bengaluru, India', { exact: false })).toBeVisible()
  833 |   })
  834 | })
  835 | 
```