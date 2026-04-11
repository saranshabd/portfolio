# Terminal Portfolio Docs

This repository is a single-screen terminal portfolio built with the Next.js App Router. The site intentionally has a small runtime surface area: one route, one shell component, markdown-backed command content, and client-side session persistence.

## Read This First

- [Architecture Overview](./architecture.md): high-level map of the runtime and data flow.
- [Terminal UI](./terminal-ui.md): how the terminal shell is composed, focused, scrolled, and visually rendered.
- [Markdown Renderer](./markdown-renderer.md): how markdown is turned into terminal-native output.
- [Commands](./commands.md): how built-in and custom commands are loaded, resolved, and rendered.
- [Testing](./testing.md): how Playwright verifies shell behavior and command coverage.

## Source Map

- `app/layout.js`: global layout, font loading, metadata.
- `app/page.js`: server entrypoint that loads terminal content and renders the shell.
- `app/globals.css`: terminal design tokens and all shell/layout styling.
- `components/TerminalShell.js`: client runtime for hydration, focus, input, history, and command dispatch.
- `components/MarkdownRenderer.js`: markdown-to-React renderer tuned for terminal output.
- `lib/terminal-content.js`: server-side loader for welcome content and command markdown.
- `lib/command-markdown.js`: section splitting and summary extraction for command files.
- `lib/terminal-storage.js`: IndexedDB persistence layer for shell session history.
- `public/commands/builtins/*.md`: documentation for built-in commands.
- `public/commands/custom/*.md`: executable custom command content.
- `public/content/welcome.md`: intro screen content shown on empty-history loads.

## Editing Guidance

- Add or update markdown-backed commands by editing `public/commands/custom/<name>.md`.
- Add or update built-in command docs by editing `public/commands/builtins/<name>.md`.
- If command parsing rules change, update both `lib/command-markdown.js` and the Playwright fixtures logic in `tests/e2e/terminal.spec.js`.
- If terminal behavior changes, update Playwright coverage at the same time.
