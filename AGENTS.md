# AGENTS

This repository is a single-screen terminal portfolio built with Next.js App Router.

## Default Guidance

- Start with [docs/README.md](/Users/shabdsaran/Desktop/batcave/portfolio/docs/README.md).
- Use the focused docs instead of loading the whole codebase at once.
- Keep `AGENTS.md` short; put detailed architecture notes under `docs/`.

## Where To Read

- Terminal shell and UI behavior: [docs/terminal-ui.md](/Users/shabdsaran/Desktop/batcave/portfolio/docs/terminal-ui.md)
- Markdown rendering: [docs/markdown-renderer.md](/Users/shabdsaran/Desktop/batcave/portfolio/docs/markdown-renderer.md)
- Command architecture and dispatch: [docs/commands.md](/Users/shabdsaran/Desktop/batcave/portfolio/docs/commands.md)
- High-level runtime map: [docs/architecture.md](/Users/shabdsaran/Desktop/batcave/portfolio/docs/architecture.md)
- Tests and verification loop: [docs/testing.md](/Users/shabdsaran/Desktop/batcave/portfolio/docs/testing.md)

## Working Rules

- Treat `components/TerminalShell.js` as the runtime center of the app.
- Treat `commands/*` as content, not arbitrary assets.
- If you change command parsing rules, update Playwright coverage too.
- Use `pnpm` as the package manager for installs, scripts, and lockfiles.
- If you change shell behavior, verify it with `pnpm test:e2e`.
