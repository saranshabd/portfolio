# Architecture Overview

## Runtime Shape

The site is intentionally narrow:

- `app/layout.js` sets up the global document, local JetBrains Mono font loading, metadata, and analytics.
- `app/page.js` renders the terminal shell in normal root boot mode.
- `app/[...segments]/page.js` renders the same shell for every non-root route and delegates route resolution to the shared page handler.
- `app/terminal-page.js` holds the shared page-rendering logic.
- `components/TerminalShell.js` is the main client runtime. It owns shell state, startup hydration, input capture, command dispatch, scrolling, and persistence writes.
- `components/MarkdownRenderer.js` turns markdown strings into React elements styled to feel like terminal output instead of article prose.

There is no multi-layout portfolio routing anymore. Every route renders the same terminal interface, and non-root paths boot by auto-submitting either a derived `cat <slug>` content command or a normal command path.

## Routing Contract

The App Router is intentionally split into two entry modes that both render the same shell:

- Root mode via `app/page.js`: loads the shell for `/` and allows normal client-side session restore.
- Route mode via `app/[...segments]/page.js`: catches every non-root path and passes the decoded segments into `app/terminal-page.js` for resolution.

This means:

- `/big-tech-vs-startups-the-myths-and-realities` resolves to the content file `content/big-tech-vs-startups-the-myths-and-realities.md` and boots as `cat big-tech-vs-startups-the-myths-and-realities`
- `/about` becomes `about`
- `/birthday/2023` becomes `birthday 2023`
- `/totally/made/up` becomes `totally made up` and still renders the shell, which then shows the normal unknown-command error if no content slug matches

The framework router is not used to distinguish valid and invalid portfolio pages. Content and command resolution happen inside the shell runtime instead.

## Data Flow

The page render path is:

1. `app/page.js` or `app/[...segments]/page.js` calls `renderTerminalPage()` in `app/terminal-page.js`.
2. `lib/terminal-content.js` reads markdown files from `content`, `commands/builtins`, and `commands/custom`.
3. Command markdown is normalized by `lib/command-markdown.js` into:
   - `manual`: content above the `---` divider
   - `output`: content below the `---` divider
   - `summary`: a short derived line used in generated help output
4. Flat content markdown is indexed by slug and also provides the welcome markdown through `intro.md`.
5. `app/terminal-page.js` resolves route segments in this order:
   - content slug match -> `cat <slug>`
   - command/subcommand string
6. The loaded content plus boot props are passed into `TerminalShell`.
7. `TerminalShell` hydrates client-side state and either restores the root session, shows welcome, or auto-runs the route-derived input.

## State Model

The terminal UI stores an ordered array of `entries`. Each entry is rendered in the output pane and has a `type` plus markdown/text content.

Entry types currently include:

- `welcome`: the intro panel shown on never-initialized root loads
- `prompt`: the prompt line showing the command the user entered
- `output`: normal command output
- `error`: shell-style failure output, including unknown commands

This entry list is the canonical session history. Browser persistence can be disabled with `IS_BROWSER_PERSISTENCE_ENABLED` in `lib/terminal-config.js`, in which case the history stays in-memory only for the current page session.

## Persistence Boundary

Persistence is purely client-side:

- `lib/terminal-storage.js` stores the root session record in IndexedDB under the key `root-session`.
- `lib/terminal-config.js` controls whether those IndexedDB reads and writes are enabled at all.
- The record shape is:
  - `initialized: boolean`
  - `entries: TerminalEntry[]`

At page load:

- If no stored root session exists, the `/` shell shows the welcome screen.
- If a stored root session exists and has entries, `/` restores them.
- If a stored root session exists but the entries array is empty, `/` shows the welcome screen again.
- If the current route is non-root, the shell skips restore and replaces visible history with the derived route input for that load.
- Reloading a non-root route repeats the same route boot and does not preserve ad hoc command history from that subpage session.

That distinction matters because `clear` resets the root shell back to the intro experience, while route-driven loads intentionally remain ephemeral.

## Content Boundary

Terminal content is file-driven, not hardcoded into JSX:

- Built-in docs live in `commands/builtins`.
- Executable custom commands live in `commands/custom`.
- Flat content pages live in `content`.
- The welcome panel is sourced from `content/intro.md`.

This split matters because built-in commands are behaviorally implemented in code, custom commands are markdown-backed command outputs, and flat content pages are markdown-backed documents rendered through the built-in `cat` command.
