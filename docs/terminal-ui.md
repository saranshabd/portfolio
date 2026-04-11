# Terminal UI

## Shell Composition

The terminal interface is rendered by `components/TerminalShell.js`. It has two major visible regions:

- `.terminal-output`: the scrollable output transcript
- `.terminal-input-bar`: the fixed command input bar at the bottom

The surrounding layout is defined in `app/globals.css`:

- `body` uses `overflow: hidden` so the browser page itself does not scroll.
- `.terminal-shell` and `.terminal-frame` are pinned to viewport height.
- `.terminal-output` is the only vertical scroll container in normal operation.

This is a deliberate design choice. When output grows, only the transcript should scroll; the prompt must remain visible.

## Visual System

The terminal look is driven through CSS custom properties in `:root`:

- background surfaces
- text and muted text
- prompt color
- accent color
- error color
- border and shadow tokens

JetBrains Mono is loaded locally in `app/layout.js` using `next/font/local`. The font files are vendored in `app/fonts/` so builds do not depend on Google Fonts network access.

## Input Construction

The input bar is intentionally not a plain visible browser text field.

Instead, it is composed from:

- a visible prompt label
- a visible mirrored input display
- a transparent real `<input>` layered on top for actual keyboard capture

This is how the old-school terminal cursor effect is implemented:

- the real input remains focusable and handles typing, form submission, and mobile keyboard interaction
- the mirrored display shows `inputValue`
- a fake block cursor element is rendered next to the mirrored text
- CSS animation creates the blinking block cursor

The benefit is that the UI can look like a terminal while still using a normal HTML input for accessibility and browser behavior.

## Focus Behavior

The shell behaves like a terminal rather than a form-heavy web app.

Focus logic works in two layers:

### Initial focus

Once hydration finishes, the input is focused automatically.

### Global typing capture

If the user clicks elsewhere in the terminal and then starts typing:

- `TerminalShell` listens for global `keydown` events
- printable keys are redirected into the bottom input
- modifier combinations like `Cmd`, `Ctrl`, and `Alt` are ignored
- editable targets such as real inputs, textareas, or contenteditable nodes are not intercepted

This ensures the user does not need to manually refocus the prompt after interacting with terminal content.

## Scroll Behavior

When a new command appends output:

- `entries` state changes
- a `useLayoutEffect` runs after the DOM update
- the shell scrolls `.terminal-output` directly to `scrollHeight`

The shell does not rely on `scrollIntoView()` for the bottom edge anymore. Directly scrolling the output pane avoids accidental document-level scrolling and keeps the bottom prompt visible.

## Why `useLayoutEffect`

Scroll correction happens in `useLayoutEffect` rather than `useEffect` because the terminal wants to adjust the scroll position immediately after React has committed the new output. That minimizes visible scroll lag or one-frame jumps after large command output is rendered.
