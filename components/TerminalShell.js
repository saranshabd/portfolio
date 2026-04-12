'use client'

import { House } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import MarkdownRenderer from './MarkdownRenderer'
import { loadRootSession, saveRootSession } from '../lib/terminal-storage'

const PROMPT_LABEL = 'internet@127.0.0.1'

function createEntry(type, content) {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    content,
  }
}

function createPromptEntry(command) {
  return createEntry('prompt', {
    prompt: `${PROMPT_LABEL}:~$`,
    command,
  })
}

function createWelcomeEntry(markdown) {
  return createEntry('welcome', markdown)
}

function createCommandMap(commands) {
  return commands.reduce((commandMap, command) => {
    commandMap[command.name.toLowerCase()] = command
    return commandMap
  }, {})
}

function getSummaryForNode(commandName, manualIndex, runnableIndex) {
  return manualIndex[commandName]?.summary ?? runnableIndex[commandName]?.summary ?? ''
}

function collapseVariantBranch(node, prefixTokens = []) {
  const branchTokens = [...prefixTokens, node.token]

  if (!node.isRunnable && node.children.length === 1) {
    return collapseVariantBranch(node.children[0], branchTokens)
  }

  return {
    label: branchTokens.join(' '),
    node,
  }
}

function buildCustomHelpEntries(customRunnableCommands, customManualEntries) {
  const rootNodes = []
  const nodesByPath = new Map()
  const manualIndex = createCommandMap(customManualEntries)
  const runnableIndex = createCommandMap(customRunnableCommands)

  for (const command of customRunnableCommands) {
    const tokens = command.name.split(' ')
    let pathKey = ''
    let parentNode = null

    for (const token of tokens) {
      pathKey = pathKey ? `${pathKey} ${token}` : token

      if (!nodesByPath.has(pathKey)) {
        const node = {
          token,
          path: pathKey,
          isRunnable: false,
          children: [],
        }

        nodesByPath.set(pathKey, node)

        if (parentNode) {
          parentNode.children.push(node)
        } else {
          rootNodes.push(node)
        }
      }

      parentNode = nodesByPath.get(pathKey)
    }

    if (parentNode) {
      parentNode.isRunnable = true
    }
  }

  function toHelpEntry(node) {
    const commandName = node.path

    if (node.children.length === 0) {
      return {
        label: commandName,
        summary: getSummaryForNode(commandName, manualIndex, runnableIndex),
      }
    }

    const variants = node.children
      .map((childNode) => collapseVariantBranch(childNode))
      .map((childBranch) => childBranch.label)

    return {
      label: `${commandName} {${variants.join(', ')}}`,
      summary: getSummaryForNode(commandName, manualIndex, runnableIndex),
    }
  }

  return rootNodes
    .map((node) => toHelpEntry(node))
    .sort((left, right) => left.label.localeCompare(right.label))
}

function buildHelpMarkdown({ builtins, customRunnableCommands, customManualEntries }) {
  const builtinList = builtins
    .map((command) => `- \`${command.name}\`${command.summary ? ` - ${command.summary}` : ''}`)
    .join('\n')

  const customHelpEntries = buildCustomHelpEntries(
    customRunnableCommands,
    customManualEntries
  )
  const customList =
    customHelpEntries.length > 0
      ? customHelpEntries
          .map(
            (entry) => `- \`${entry.label}\`${entry.summary ? ` - ${entry.summary}` : ''}`
          )
          .join('\n')
      : '- No custom commands installed yet.'

  return [
    '# Available Commands',
    '',
    '## Built-ins',
    builtinList,
    '',
    '## Custom',
    customList,
    '',
    'Use `man <command>` to inspect any command before you run it.',
  ].join('\n')
}

function buildUnknownCommandMarkdown(command) {
  return `\`${command}\`: command not found\n\nRun \`help\` to inspect available commands.`
}

function buildManErrorMarkdown(command) {
  return command
    ? `No manual entry for \`${command}\`. Run \`help\` to inspect available commands.`
    : 'Usage: `man <command>`'
}

function buildCatUsageMarkdown() {
  return 'Usage: `cat <slug>`'
}

function buildCatMissingContentMarkdown(slug) {
  return slug
    ? `No content file found for \`${slug}\`.`
    : buildCatUsageMarkdown()
}

function parseCommandLine(commandLine) {
  return commandLine
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function normalizeCommandName(tokens) {
  return tokens.map((token) => token.toLowerCase()).join(' ')
}

function getInputDisplaySegments(inputValue) {
  if (!inputValue) {
    return {
      leadingWhitespace: '',
      parentToken: '',
      suffix: '',
    }
  }

  const match = inputValue.match(/^(\s*)(\S+)?([\s\S]*)$/u)

  return {
    leadingWhitespace: match?.[1] ?? '',
    parentToken: match?.[2] ?? '',
    suffix: match?.[3] ?? '',
  }
}

function normalizePromptContent(content) {
  if (content && typeof content === 'object') {
    return {
      prompt: content.prompt ?? `${PROMPT_LABEL}:~$`,
      command: content.command ?? '',
    }
  }

  const legacyPrefix = `${PROMPT_LABEL}:~$`

  if (typeof content === 'string' && content.startsWith(legacyPrefix)) {
    return {
      prompt: legacyPrefix,
      command: content.slice(legacyPrefix.length).trimStart(),
    }
  }

  return {
    prompt: legacyPrefix,
    command: typeof content === 'string' ? content : '',
  }
}

function deleteSelectedRange(value, selectionStart, selectionEnd) {
  return {
    nextValue: value.slice(0, selectionStart) + value.slice(selectionEnd),
    nextSelectionStart: selectionStart,
    nextSelectionEnd: selectionStart,
  }
}

function deleteWordLeft(value, selectionStart, selectionEnd) {
  if (selectionStart !== selectionEnd) {
    return deleteSelectedRange(value, selectionStart, selectionEnd)
  }

  let deleteStart = selectionStart

  while (deleteStart > 0 && /\s/u.test(value.charAt(deleteStart - 1))) {
    deleteStart -= 1
  }

  while (deleteStart > 0 && !/\s/u.test(value.charAt(deleteStart - 1))) {
    deleteStart -= 1
  }

  return deleteSelectedRange(value, deleteStart, selectionEnd)
}

function deleteToLineStart(value, selectionStart, selectionEnd) {
  const deleteEnd = selectionStart === selectionEnd ? selectionStart : selectionEnd

  return {
    nextValue: value.slice(deleteEnd),
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  }
}

export default function TerminalShell({
  bootMode = 'root',
  builtins,
  contentEntries,
  customManualEntries,
  customRunnableCommands,
  knownParentCommands = [],
  initialCommand = '',
  isContentRoute = false,
  welcomeMarkdown,
}) {
  const [entries, setEntries] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)

  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const pendingSelectionRef = useRef(null)
  const shouldKeepInitialScrollTopRef = useRef(isContentRoute)

  const manualIndex = createCommandMap([...builtins, ...customManualEntries])
  const runnableIndex = createCommandMap(customRunnableCommands)
  const contentIndex = createCommandMap(
    contentEntries.map((entry) => ({
      name: entry.name,
      output: entry.body,
    }))
  )
  const knownParentCommandSet = new Set(knownParentCommands)
  const inputDisplay = getInputDisplaySegments(inputValue)
  const isKnownParentCommand =
    inputDisplay.parentToken.length > 0 &&
    knownParentCommandSet.has(inputDisplay.parentToken.toLowerCase())

  useEffect(() => {
    shouldKeepInitialScrollTopRef.current = isContentRoute
  }, [isContentRoute, initialCommand])

  async function persistRootEntries(nextEntries) {
    setEntries(nextEntries)
    await saveRootSession({
      initialized: true,
      entries: nextEntries,
    })
  }

  function commitRouteEntries(nextEntries) {
    setEntries(nextEntries)
  }

  async function clearTerminal({ persist }) {
    if (persist) {
      await persistRootEntries([])
    } else {
      commitRouteEntries([])
    }
  }

  async function executeCommand(commandLine, existingEntries, { persist }) {
    const tokens = parseCommandLine(commandLine)

    if (tokens.length === 0) {
      return
    }

    const normalizedCommand = normalizeCommandName(tokens)
    const normalizedCommandName = tokens[0].toLowerCase()
    const nextEntries = [...existingEntries, createPromptEntry(commandLine)]

    if (normalizedCommandName === 'clear') {
      await clearTerminal({ persist })
      return
    }

    if (normalizedCommandName === 'help') {
      nextEntries.push(
        createEntry(
          'output',
          buildHelpMarkdown({
            builtins,
            customRunnableCommands,
            customManualEntries,
          })
        )
      )

      if (persist) {
        await persistRootEntries(nextEntries)
      } else {
        commitRouteEntries(nextEntries)
      }

      return
    }

    if (normalizedCommandName === 'man') {
      const requestedTokens = tokens.slice(1)
      const requestedCommand = normalizeCommandName(requestedTokens)
      const manualEntry =
        requestedTokens.length === 1 ? manualIndex[requestedCommand]?.manual : null

      nextEntries.push(
        createEntry(
          manualEntry ? 'output' : 'error',
          manualEntry ?? buildManErrorMarkdown(requestedCommand)
        )
      )

      if (persist) {
        await persistRootEntries(nextEntries)
      } else {
        commitRouteEntries(nextEntries)
      }

      return
    }

    if (normalizedCommandName === 'cat') {
      const requestedTokens = tokens.slice(1)
      const requestedSlug = normalizeCommandName(requestedTokens)
      const contentEntry =
        requestedTokens.length === 1 ? contentIndex[requestedSlug] : null

      nextEntries.push(
        createEntry(
          contentEntry ? 'output' : 'error',
          contentEntry?.output ?? buildCatMissingContentMarkdown(requestedSlug)
        )
      )

      if (persist) {
        await persistRootEntries(nextEntries)
      } else {
        commitRouteEntries(nextEntries)
      }

      return
    }

    const customCommand = runnableIndex[normalizedCommand]

    nextEntries.push(
      createEntry(
        customCommand ? 'output' : 'error',
        customCommand?.output ?? buildUnknownCommandMarkdown(normalizedCommand)
      )
    )

    if (persist) {
      await persistRootEntries(nextEntries)
    } else {
      commitRouteEntries(nextEntries)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function hydrateTerminal() {
      if (bootMode === 'route') {
        const routeEntries = []

        if (initialCommand) {
          await executeCommand(initialCommand, routeEntries, { persist: false })
        } else {
          commitRouteEntries(routeEntries)
        }

        if (isMounted) {
          setIsHydrated(true)
        }

        return
      }

      const storedSession = await loadRootSession()

      if (!isMounted) {
        return
      }

      if (storedSession?.initialized && (storedSession.entries?.length ?? 0) > 0) {
        setEntries(storedSession.entries ?? [])
      } else {
        setEntries([createWelcomeEntry(welcomeMarkdown)])
      }

      setIsHydrated(true)
    }

    hydrateTerminal()

    return () => {
      isMounted = false
    }
  }, [bootMode, initialCommand, welcomeMarkdown])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    inputRef.current?.focus()
  }, [isHydrated])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    function handleGlobalKeydown(event) {
      if (event.defaultPrevented) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const activeElement = document.activeElement
      const isEditableTarget =
        activeElement instanceof HTMLElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.isContentEditable)

      if (isEditableTarget) {
        return
      }

      const inputElement = inputRef.current

      if (!inputElement) {
        return
      }

      if (event.key.length === 1) {
        event.preventDefault()
        inputElement.focus({ preventScroll: true })
        setInputValue((currentValue) => currentValue + event.key)
      }
    }

    window.addEventListener('keydown', handleGlobalKeydown)

    return () => {
      window.removeEventListener('keydown', handleGlobalKeydown)
    }
  }, [isHydrated])

  useLayoutEffect(() => {
    const pendingSelection = pendingSelectionRef.current

    if (!pendingSelection) {
      return
    }

    const inputElement = inputRef.current

    if (!inputElement) {
      return
    }

    inputElement.setSelectionRange(pendingSelection.start, pendingSelection.end)
    pendingSelectionRef.current = null
  }, [inputValue])

  useLayoutEffect(() => {
    if (!isHydrated || entries.length === 0) {
      return
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      const outputElement = outputRef.current

      if (!outputElement) {
        return
      }

      if (shouldKeepInitialScrollTopRef.current) {
        outputElement.scrollTo({
          top: 0,
          behavior: 'auto',
        })
        shouldKeepInitialScrollTopRef.current = false
        return
      }

      outputElement.scrollTo({
        top: outputElement.scrollHeight,
        behavior: 'auto',
      })
    })

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [entries, isHydrated])

  async function handleCommandSubmission(event) {
    event.preventDefault()

    const commandLine = inputValue.trim()

    if (!commandLine || !isHydrated) {
      return
    }

    setInputValue('')
    await executeCommand(commandLine, entries, { persist: bootMode === 'root' })
  }

  function handleInputKeyDown(event) {
    if (!event.ctrlKey || event.metaKey || event.altKey) {
      return
    }

    const normalizedKey = event.key.toLowerCase()

    if (normalizedKey === 'l') {
      event.preventDefault()
      setInputValue('')
      void clearTerminal({ persist: bootMode === 'root' })
      return
    }

    if (normalizedKey !== 'u' && normalizedKey !== 'w') {
      return
    }

    const inputElement = event.currentTarget
    const selectionStart = inputElement.selectionStart ?? inputValue.length
    const selectionEnd = inputElement.selectionEnd ?? inputValue.length
    const editResult =
      normalizedKey === 'w'
        ? deleteWordLeft(inputValue, selectionStart, selectionEnd)
        : deleteToLineStart(inputValue, selectionStart, selectionEnd)

    event.preventDefault()
    pendingSelectionRef.current = {
      start: editResult.nextSelectionStart,
      end: editResult.nextSelectionEnd,
    }
    setInputValue(editResult.nextValue)
  }

  return (
    <main className="terminal-shell" data-testid="terminal-shell">
      <section className="terminal-frame">
        <div
          className="terminal-output"
          data-testid="terminal-output"
          ref={outputRef}
        >
          {bootMode === 'route' ? (
            <div className="terminal-route-toolbar" data-testid="terminal-route-toolbar">
              <Link
                aria-label="Go to home page"
                className="terminal-home-button"
                data-testid="terminal-home-button"
                href="/"
              >
                <House
                  aria-hidden="true"
                  className="terminal-home-button__icon"
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          ) : null}
          {entries.map((entry) => (
            <article
              className={`terminal-entry terminal-entry--${entry.type}`}
              data-testid="terminal-entry"
              key={entry.id}
            >
              {entry.type === 'prompt' ? (
                (() => {
                  const promptContent = normalizePromptContent(entry.content)

                  return (
                    <p className="terminal-prompt-line">
                      <span className="terminal-prompt-line__label">
                        {promptContent.prompt}
                      </span>
                      <span className="terminal-prompt-line__command">
                        {promptContent.command || '\u00a0'}
                      </span>
                    </p>
                  )
                })()
              ) : (
                <div className="terminal-markdown">
                  <MarkdownRenderer>{entry.content}</MarkdownRenderer>
                </div>
              )}
            </article>
          ))}
        </div>

        <form
          className="terminal-input-bar"
          data-testid="terminal-input-bar"
          onSubmit={handleCommandSubmission}
        >
          <label className="terminal-input-shell" htmlFor="terminal-input">
            <span className="terminal-input-prompt">{PROMPT_LABEL}:~$</span>
            <div className="terminal-input-viewport">
              <div
                aria-hidden="true"
                className="terminal-input-display"
                data-testid="terminal-input-display"
              >
                <span className="terminal-input-text">
                  {inputValue ? (
                    <>
                      {inputDisplay.leadingWhitespace ? (
                        <span>{inputDisplay.leadingWhitespace}</span>
                      ) : null}
                      {inputDisplay.parentToken ? (
                        <span
                          className={
                            isKnownParentCommand
                              ? 'terminal-input-parent-token terminal-input-parent-token--highlighted'
                              : 'terminal-input-parent-token'
                          }
                          data-testid="terminal-input-parent-token"
                        >
                          {inputDisplay.parentToken}
                        </span>
                      ) : null}
                      {inputDisplay.suffix ? (
                        <span
                          className="terminal-input-suffix"
                          data-testid="terminal-input-suffix"
                        >
                          {inputDisplay.suffix}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    '\u00a0'
                  )}
                </span>
                <span className="terminal-input-cursor" />
              </div>
              <input
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                className="terminal-input"
                data-testid="terminal-input"
                disabled={!isHydrated}
                id="terminal-input"
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleInputKeyDown}
                ref={inputRef}
                spellCheck={false}
                type="text"
                value={inputValue}
              />
            </div>
          </label>
        </form>
      </section>
    </main>
  )
}
