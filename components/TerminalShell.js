'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import MarkdownRenderer from './MarkdownRenderer'
import { loadRootSession, saveRootSession } from '../lib/terminal-storage'

const PROMPT_LABEL = 'shabd@portfolio'

function createEntry(type, content) {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    content,
  }
}

function createPromptEntry(command) {
  return createEntry('prompt', `${PROMPT_LABEL}:~$ ${command}`)
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

function parseCommandLine(commandLine) {
  return commandLine
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function normalizeCommandName(tokens) {
  return tokens.map((token) => token.toLowerCase()).join(' ')
}

export default function TerminalShell({
  bootMode = 'root',
  builtins,
  customManualEntries,
  customRunnableCommands,
  initialCommand = '',
  welcomeMarkdown,
}) {
  const [entries, setEntries] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)

  const inputRef = useRef(null)
  const outputRef = useRef(null)

  const manualIndex = createCommandMap([...builtins, ...customManualEntries])
  const runnableIndex = createCommandMap(customRunnableCommands)

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

  async function executeCommand(commandLine, existingEntries, { persist }) {
    const tokens = parseCommandLine(commandLine)

    if (tokens.length === 0) {
      return
    }

    const normalizedCommand = normalizeCommandName(tokens)
    const normalizedCommandName = tokens[0].toLowerCase()
    const nextEntries = [...existingEntries, createPromptEntry(commandLine)]

    if (normalizedCommandName === 'clear') {
      if (persist) {
        await persistRootEntries([])
      } else {
        commitRouteEntries([])
      }

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

      if (storedSession?.initialized) {
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
    if (!isHydrated || entries.length === 0) {
      return
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      const outputElement = outputRef.current

      if (!outputElement) {
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

  return (
    <main className="terminal-shell" data-testid="terminal-shell">
      <section className="terminal-frame">
        <div
          className="terminal-output"
          data-testid="terminal-output"
          ref={outputRef}
        >
          {entries.map((entry) => (
            <article
              className={`terminal-entry terminal-entry--${entry.type}`}
              data-testid="terminal-entry"
              key={entry.id}
            >
              {entry.type === 'prompt' ? (
                <p className="terminal-prompt-line">{entry.content}</p>
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
                  {inputValue || '\u00a0'}
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
