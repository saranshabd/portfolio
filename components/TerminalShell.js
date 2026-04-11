'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import MarkdownRenderer from './MarkdownRenderer'
import { loadSession, saveSession } from '../lib/terminal-storage'

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

function buildHelpMarkdown({ builtins, customCommands }) {
  const builtinList = builtins
    .map((command) => `- \`${command.name}\`${command.summary ? ` - ${command.summary}` : ''}`)
    .join('\n')

  const customList =
    customCommands.length > 0
      ? customCommands
          .map(
            (command) =>
              `- \`${command.name}\`${command.summary ? ` - ${command.summary}` : ''}`
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

function indexCommands(builtins, customCommands) {
  return [...builtins, ...customCommands].reduce((commandIndex, command) => {
    commandIndex[command.name] = command
    return commandIndex
  }, {})
}

export default function TerminalShell({
  builtins,
  customCommands,
  welcomeMarkdown,
}) {
  const [entries, setEntries] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)

  const inputRef = useRef(null)
  const outputRef = useRef(null)

  const commandIndex = indexCommands(builtins, customCommands)

  useEffect(() => {
    let isMounted = true

    async function hydrateTerminal() {
      const storedSession = await loadSession()

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
  }, [welcomeMarkdown])

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

  async function commitEntries(nextEntries) {
    setEntries(nextEntries)
    await saveSession({
      initialized: true,
      entries: nextEntries,
    })
  }

  async function handleCommandSubmission(event) {
    event.preventDefault()

    const commandLine = inputValue.trim()

    if (!commandLine || !isHydrated) {
      return
    }

    const [commandName, ...args] = commandLine.split(/\s+/)
    const normalizedCommand = commandName.toLowerCase()

    setInputValue('')

    if (normalizedCommand === 'clear') {
      await commitEntries([])
      return
    }

    const nextEntries = [...entries, createPromptEntry(commandLine)]

    if (normalizedCommand === 'help') {
      nextEntries.push(
        createEntry(
          'output',
          buildHelpMarkdown({
            builtins,
            customCommands,
          })
        )
      )

      await commitEntries(nextEntries)
      return
    }

    if (normalizedCommand === 'man') {
      const requestedCommand = args[0]?.toLowerCase()
      const manualEntry = requestedCommand
        ? commandIndex[requestedCommand]?.manual
        : null

      nextEntries.push(
        createEntry(
          manualEntry ? 'output' : 'error',
          manualEntry ?? buildManErrorMarkdown(requestedCommand)
        )
      )

      await commitEntries(nextEntries)
      return
    }

    const customCommand = commandIndex[normalizedCommand]

    if (customCommand?.kind === 'custom') {
      nextEntries.push(createEntry('output', customCommand.output))
      await commitEntries(nextEntries)
      return
    }

    nextEntries.push(
      createEntry('error', buildUnknownCommandMarkdown(normalizedCommand))
    )

    await commitEntries(nextEntries)
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
