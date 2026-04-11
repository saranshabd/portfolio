# Commands

## Overview

Commands are split into two categories:

- built-in commands: behavior implemented in `components/TerminalShell.js`
- custom commands: executable content loaded from markdown files in `public/commands/custom`

Both categories share a common documentation model based on markdown files.

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
- `public/commands/custom/*.md`
- `public/content/welcome.md`

For each command file it produces a normalized command object:

- `kind`: `builtin` or `custom`
- `name`: filename without `.md`
- `manual`: content above the divider
- `output`: content below the divider
- `summary`: a short line derived from the manual section

The summary is used to generate the `help` listing.

## Built-In Commands

Built-ins are fixed in code:

- `help`
- `man`
- `clear`

Their visible documentation is still markdown-backed, but their execution logic lives in `TerminalShell`.

### `help`

`help` is generated dynamically by `buildHelpMarkdown()`.

It combines:

- all built-in command docs
- all discovered custom commands

The result is emitted as a normal terminal output entry.

### `man <command>`

`man` looks up the requested command in a combined in-memory command index built by `indexCommands()`.

If the command exists:

- the command's `manual` markdown is rendered

If the command does not exist:

- an error entry is emitted with a shell-style message

### `clear`

`clear` is behaviorally special:

- it wipes visible entries in memory
- it persists an empty `entries` array into IndexedDB

The next reload then shows the welcome panel because hydration treats empty history as a first-load state.

## Custom Commands

Custom commands are file-discovered. There is no central registry in code.

To add a new custom command:

1. Create `public/commands/custom/<command>.md`.
2. Put the manual text above `---`.
3. Put the visible command output below `---`.

At runtime:

- the loader reads the file
- `TerminalShell` indexes it by filename
- entering `<command>` emits the markdown from the command's `output` section

This makes command expansion mostly content work rather than React work.

## Command Dispatch Flow

When the user submits a command:

1. `handleCommandSubmission()` trims and tokenizes the input.
2. The command name is normalized to lowercase.
3. The shell appends a `prompt` entry showing what the user typed.
4. Dispatch happens in this order:
   - `clear`
   - `help`
   - `man`
   - custom command lookup
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

This design gives the portfolio a stable shell with a content-driven extension surface.
