# Architecture Overview

## Runtime Shape

The site is intentionally narrow:

- `app/layout.js` sets up the global document, local JetBrains Mono font loading, metadata, and analytics.
- `app/page.js` is the only page entrypoint. It performs the server-side content load and renders the terminal shell.
- `components/TerminalShell.js` is the main client runtime. It owns shell state, startup hydration, input capture, command dispatch, scrolling, and persistence writes.
- `components/MarkdownRenderer.js` turns markdown strings into React elements styled to feel like terminal output instead of article prose.

There is no multi-page portfolio routing anymore. The product is one terminal interface mounted at `/`.

## Data Flow

The page render path is:

1. `app/page.js` calls `loadTerminalContent()`.
2. `lib/terminal-content.js` reads markdown files from `public/content`, `public/commands/builtins`, and `public/commands/custom`.
3. Command markdown is normalized by `lib/command-markdown.js` into:
   - `manual`: content above the `---` divider
   - `output`: content below the `---` divider
   - `summary`: a short derived line used in generated help output
4. The loaded content is passed into `TerminalShell`.
5. `TerminalShell` hydrates client-side state and decides whether to restore history from IndexedDB or show the welcome screen.

## State Model

The terminal UI stores an ordered array of `entries`. Each entry is rendered in the output pane and has a `type` plus markdown/text content.

Entry types currently include:

- `welcome`: the intro panel shown on empty-history loads
- `prompt`: the prompt line showing the command the user entered
- `output`: normal command output
- `error`: shell-style failure output, including unknown commands

This entry list is the canonical session history and is persisted in IndexedDB.

## Persistence Boundary

Persistence is purely client-side:

- `lib/terminal-storage.js` stores one session record in IndexedDB under the key `session`.
- The record shape is:
  - `initialized: boolean`
  - `entries: TerminalEntry[]`

At page load:

- If no stored session exists, the shell shows the welcome screen.
- If a stored session exists and has entries, the shell restores them.
- If a stored session exists but `entries` is empty, the shell treats that as empty history and shows the welcome screen again.

That last rule is important because `clear` empties session history, and a later reload should behave like a fresh visit.

## Content Boundary

Command content is file-driven, not hardcoded into JSX:

- Built-in docs live in `public/commands/builtins`.
- Executable custom commands live in `public/commands/custom`.
- The welcome panel lives in `public/content/welcome.md`.

This split matters because built-in commands are behaviorally implemented in code, but their visible documentation is maintained as markdown.
