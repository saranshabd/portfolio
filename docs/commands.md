# Commands

## Overview

Commands are split into two categories:

- built-in commands: behavior implemented in `components/TerminalShell.js`
- custom commands: executable content loaded from markdown files in `public/commands/custom`

Both categories share a common documentation model based on markdown files. This command system is separate from flat content pages in `public/content`, which are rendered via the built-in `cat` command and routed before command lookup.

## Command File Format

Every command markdown file follows the same structure:

```md
# command-name

Manual or help content.
---
Executable output content.
```

The `---` divider is the contract.

- Content above `---` becomes the manual/help section.
- Content below `---` becomes the executable output section.

Parsing is handled by `splitMarkdownSections()` in `lib/command-markdown.js`.

## Content Loading

`lib/terminal-content.js` loads the terminal content on the server before the shell is rendered.

It reads:

- `public/commands/builtins/*.md`
- `public/commands/custom/**/*`
- `public/content/*.md`

For built-ins it produces a flat command list. For custom commands it produces two related indexes:

- runnable commands keyed by full token path, such as `about`, `status professional`, or `birthday 2023`
- manual entries keyed by command node, such as `about`, `status`, or `birthday`

Each command record still carries:

- `kind`: `builtin` or `custom`
- `name`: normalized token path joined by spaces
- `manual`: content above the divider
- `output`: content below the divider
- `summary`: a short line derived from the manual section

The summary is used to generate the `help` listing.

Content files are loaded as a separate flat index keyed by slug:

- `public/content/intro.md` -> `intro`
- `public/content/big-tech-vs-startups-the-myths-and-realities.md` -> `big-tech-vs-startups-the-myths-and-realities`

These files do not use the `---` command divider contract. Their full body is rendered as normal markdown output.

## Built-In Commands

Built-ins are fixed in code:

- `help`
- `man`
- `clear`
- `cat`

Their visible documentation is still markdown-backed, but their execution logic lives in `TerminalShell`.

### `help`

`help` is generated dynamically by `buildHelpMarkdown()`.

It combines:

- all built-in command docs
- all discovered custom commands, grouped by command node when they have nested variants

The result is emitted as a normal terminal output entry.

### `man <command>`

`man` looks up the requested command in a combined in-memory command index built by `indexCommands()`.

If the command exists:

- the command's `manual` markdown is rendered

Custom manual lookup supports both:

- `public/commands/custom/<command>.md`
- `public/commands/custom/<command>/index.md`

If the command does not exist:

- an error entry is emitted with a shell-style message

### `clear`

`clear` is behaviorally special:

- it wipes visible entries in memory
- it persists an empty `entries` array into IndexedDB

The next root reload shows the welcome panel again because empty history is treated like a fresh root visit.

### `cat <slug>`

`cat` renders the body of a file from `public/content`.

If the requested slug exists:

- the content markdown is emitted as a normal terminal output entry

If the slug is missing or omitted:

- an error entry is emitted with usage or missing-content guidance

## Custom Commands

Custom commands are file-discovered. There is no central registry in code.

To add a new custom command:

1. Create one of:
   - `public/commands/custom/<command>.md`
   - `public/commands/custom/<command>/index.md`
   - `public/commands/custom/<command>/<arg>.md`
2. Put the manual text above `---`.
3. Put the visible command output below `---`.

At runtime:

- non-`index.md` files become runnable commands keyed by their full path tokens
- both flat files and `index.md` files can provide `man <command>` manuals
- entering the full token path emits the markdown from the command's `output` section

This makes command expansion mostly content work rather than React work.

## Content Pages

Content pages are not commands.

To add a new content page:

1. Create `public/content/<slug>.md`.
2. Write plain markdown with no `---` split requirement.
3. Link to it from command output or other markdown using `/<slug>`.

At runtime:

- `cat <slug>` renders that file inside the terminal
- `/<slug>` boots the shell as `cat <slug>`
- if no matching content slug exists, routing falls back to normal command/subcommand resolution

## Command Dispatch Flow

When the user submits a command:

1. `handleCommandSubmission()` trims and tokenizes the input.
2. The full token sequence is normalized to lowercase.
3. The shell appends a `prompt` entry showing what the user typed.
4. Dispatch happens in this order:
   - `clear`
   - `help`
   - `man`
   - `cat`
   - custom runnable command lookup
   - unknown command fallback
5. The resulting `output` or `error` entry is appended.
6. The updated `entries` list is persisted to IndexedDB.

## Unknown Commands

Unknown commands are intentionally handled like a shell, not like a web form.

The fallback path generates markdown that says:

- the command was not found
- the user should run `help`

That output is stored as an `error` entry and rendered through the same markdown renderer as other terminal content.

## Built-In vs Custom Command Distinction

The distinction is architectural, not visual.

### Built-ins

- execution lives in JavaScript
- docs live in markdown
- output may be dynamic (`help`) or stateful (`clear`)

### Custom commands

- execution is markdown-driven
- output is static file content
- adding a command usually does not require code changes

### Content pages

- execution goes through the built-in `cat` command
- output is the full markdown file body from `public/content`
- routing can address them directly by slug without making them commands

This design gives the portfolio a stable shell with a content-driven extension surface.
