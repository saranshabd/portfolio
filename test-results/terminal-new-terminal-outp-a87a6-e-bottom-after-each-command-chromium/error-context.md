# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: terminal.spec.js >> new terminal output scrolls to the bottom after each command
- Location: tests/e2e/terminal.spec.js:557:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('terminal-input')

```

# Test source

```ts
  131 | 
  132 |       parentNode = nodesByPath.get(pathKey)
  133 |     }
  134 | 
  135 |     if (parentNode) {
  136 |       parentNode.isRunnable = true
  137 |     }
  138 |   }
  139 | 
  140 |   return rootNodes
  141 |     .map((node) => {
  142 |       const commandName = node.path
  143 | 
  144 |       if (node.children.length === 0) {
  145 |         return {
  146 |           label: commandName,
  147 |           summary: getSummaryForNode(commandName, manualIndex, runnableIndex),
  148 |         }
  149 |       }
  150 | 
  151 |       const variants = node.children
  152 |         .map((childNode) => collapseVariantBranch(childNode))
  153 |         .map((childBranch) => childBranch.label)
  154 | 
  155 |       return {
  156 |         label: `${commandName} {${variants.join(', ')}}`,
  157 |         summary: getSummaryForNode(commandName, manualIndex, runnableIndex),
  158 |       }
  159 |     })
  160 |     .sort((left, right) => left.label.localeCompare(right.label))
  161 | }
  162 | 
  163 | function readBuiltinFixtures(directory) {
  164 |   return fs
  165 |     .readdirSync(directory)
  166 |     .filter((filename) => filename.endsWith('.md'))
  167 |     .sort()
  168 |     .map((filename) => {
  169 |       const source = fs.readFileSync(path.join(directory, filename), 'utf8')
  170 |       const { manual, output } = splitMarkdownSections(source)
  171 | 
  172 |       return {
  173 |         name: path.basename(filename, '.md'),
  174 |         manual,
  175 |         output,
  176 |         summary: extractSummary(manual),
  177 |       }
  178 |     })
  179 | }
  180 | 
  181 | function readCustomFixtures(directory) {
  182 |   const files = collectMarkdownFiles(directory)
  183 |   const runnableCommands = []
  184 |   const manualEntriesByName = new Map()
  185 | 
  186 |   for (const relativeFilePath of files) {
  187 |     const source = fs.readFileSync(path.join(directory, relativeFilePath), 'utf8')
  188 |     const { manual, output } = splitMarkdownSections(source)
  189 |     const fileTokens = relativeFilePath
  190 |       .replace(/\.md$/u, '')
  191 |       .split(path.sep)
  192 |       .filter(Boolean)
  193 |     const isIndexFile = fileTokens[fileTokens.length - 1] === 'index'
  194 |     const commandTokens = isIndexFile ? fileTokens.slice(0, -1) : fileTokens
  195 |     const name = commandTokens.join(' ')
  196 | 
  197 |     if (!name) {
  198 |       continue
  199 |     }
  200 | 
  201 |     const record = {
  202 |       name,
  203 |       manual,
  204 |       output,
  205 |       summary: extractSummary(manual),
  206 |       source: relativeFilePath,
  207 |     }
  208 | 
  209 |     const existingManual = manualEntriesByName.get(name)
  210 |     if (!existingManual || relativeFilePath.endsWith(`${path.sep}index.md`)) {
  211 |       manualEntriesByName.set(name, record)
  212 |     }
  213 | 
  214 |     if (!isIndexFile) {
  215 |       runnableCommands.push(record)
  216 |     }
  217 |   }
  218 | 
  219 |   return {
  220 |     manualEntries: [...manualEntriesByName.values()].sort((left, right) =>
  221 |       left.name.localeCompare(right.name)
  222 |     ),
  223 |     runnableCommands: runnableCommands.sort((left, right) =>
  224 |       left.name.localeCompare(right.name)
  225 |     ),
  226 |   }
  227 | }
  228 | 
  229 | async function runCommand(page, command) {
  230 |   const input = page.getByTestId('terminal-input')
> 231 |   await input.fill(command)
      |               ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  232 |   await input.press('Enter')
  233 | }
  234 | 
  235 | async function setInputSelection(input, selectionStart, selectionEnd = selectionStart) {
  236 |   await input.evaluate(
  237 |     (node, { start, end }) => {
  238 |       node.focus()
  239 |       node.setSelectionRange(start, end)
  240 |     },
  241 |     { start: selectionStart, end: selectionEnd }
  242 |   )
  243 | }
  244 | 
  245 | async function expectMirroredInput(page, expectedValue) {
  246 |   const input = page.getByTestId('terminal-input')
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
```