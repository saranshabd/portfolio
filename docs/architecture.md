# Architecture Overview

## Runtime Shape

The site is intentionally narrow:

- `app/layout.js` sets up the global document, local JetBrains Mono font loading, metadata, and analytics.
- `app/page.js` renders the terminal shell in normal root boot mode.
- `app/[...segments]/page.js` renders the same shell for every non-root route and derives an initial command from the path.
- `app/terminal-page.js` holds the shared page-rendering logic.
- `components/TerminalShell.js` is the main client runtime. It owns shell state, startup hydration, input capture, command dispatch, scrolling, and persistence writes.
- `components/MarkdownRenderer.js` turns markdown strings into React elements styled to feel like terminal output instead of article prose.

There is no multi-layout portfolio routing anymore. Every route renders the same terminal interface, and non-root paths boot by auto-submitting the route-derived command.

## Data Flow

The page render path is:

1. `app/page.js` calls `loadTerminalContent()`.
2. `lib/terminal-content.js` reads markdown files from `public/content`, `public/commands/builtins`, and `public/commands/custom`.
3. Command markdown is normalized by `lib/command-markdown.js` into:
   - `manual`: content above the `---` divider
   - `output`: content below the `---` divider
   - `summary`: a short derived line used in generated help output
4. The loaded content plus boot mode props are passed into `TerminalShell`.
5. `TerminalShell` hydrates client-side state and either restores the root session, shows welcome, or auto-runs the route-derived command.

## State Model

The terminal UI stores an ordered array of `entries`. Each entry is rendered in the output pane and has a `type` plus markdown/text content.

Entry types currently include:

- `welcome`: the intro panel shown on never-initialized root loads
- `prompt`: the prompt line showing the command the user entered
- `output`: normal command output
- `error`: shell-style failure output, including unknown commands

This entry list is the canonical session history and is persisted in IndexedDB.

## Persistence Boundary

Persistence is purely client-side:

- `lib/terminal-storage.js` stores the root session record in IndexedDB under the key `root-session`.
- The record shape is:
  - `initialized: boolean`
  - `entries: TerminalEntry[]`

At page load:

- If no stored root session exists, the `/` shell shows the welcome screen.
- If a stored root session exists, `/` restores its entries even when the array is empty.
- If the current route is non-root, the shell skips restore and replaces visible history with the derived route command for that load.

That distinction matters because `clear` now empties the root session persistently, while route-driven loads intentionally remain ephemeral.

## Content Boundary

Command content is file-driven, not hardcoded into JSX:

- Built-in docs live in `public/commands/builtins`.
- Executable custom commands live in `public/commands/custom`.
- The welcome panel lives in `public/content/welcome.md`.

This split matters because built-in commands are behaviorally implemented in code, but their visible documentation is maintained as markdown.
