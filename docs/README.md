# Terminal Portfolio Docs

This repository is a single-screen terminal portfolio built with the Next.js App Router. The site intentionally has a small runtime surface area: one shell component, route-driven command boot, markdown-backed command content, and client-side root-session persistence.

## Read This First

- [Architecture Overview](./architecture.md): high-level map of the runtime and data flow.
- [Terminal UI](./terminal-ui.md): how the terminal shell is composed, focused, scrolled, and visually rendered.
- [Markdown Renderer](./markdown-renderer.md): how markdown is turned into terminal-native output.
- [Commands](./commands.md): how built-in and custom commands are loaded, resolved, and rendered.
- [Testing](./testing.md): how Playwright verifies shell behavior and command coverage.

## Source Map

- `app/layout.js`: global layout, font loading, metadata.
- `app/page.js`: root server entrypoint that renders the shell in normal boot mode.
- `app/[...segments]/page.js`: catch-all entrypoint that renders the same shell in route-command boot mode.
- `app/terminal-page.js`: shared page handler used by both root and catch-all routes.
- `app/globals.css`: terminal design tokens and all shell/layout styling.
- `components/TerminalShell.js`: client runtime for hydration, focus, input, history, and command dispatch.
- `components/MarkdownRenderer.js`: markdown-to-React renderer tuned for terminal output.
- `lib/terminal-content.js`: server-side loader for welcome content plus recursive custom command indexing.
- `lib/command-markdown.js`: section splitting and summary extraction for command files.
- `lib/terminal-storage.js`: IndexedDB persistence layer for the root shell session history.
- `public/commands/builtins/*.md`: documentation for built-in commands.
- `public/commands/custom/**/*`: executable custom command content and manual nodes.
- `public/content/welcome.md`: intro screen content shown on empty-history loads.

## Routing Model

- `/`: normal home boot. The shell restores the persisted root session when it has entries. If there is no initialized root session, or the persisted root session is empty after `clear`, the welcome markdown is shown.
- `/<...segments>`: route-command boot. The shell ignores persisted history for that load, joins the URL segments into a command such as `about` or `birthday 2023`, auto-submits it, and renders only that route-derived prompt/output pair.
- Invalid non-root routes intentionally use the same terminal shell. They auto-submit the derived command and render the standard shell-style command-not-found output instead of a framework 404 page.

## Editing Guidance

- Add or update markdown-backed commands by editing `public/commands/custom/<name>.md` or nested paths such as `public/commands/custom/<name>/index.md` and `public/commands/custom/<name>/<arg>.md`.
- Add or update built-in command docs by editing `public/commands/builtins/<name>.md`.
- If command parsing rules change, update both `lib/command-markdown.js` and the Playwright fixtures logic in `tests/e2e/terminal.spec.js`.
- If terminal behavior changes, update Playwright coverage at the same time.
