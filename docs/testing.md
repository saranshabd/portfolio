# Testing

## Test Strategy

The repository uses Playwright for end-to-end browser coverage in `tests/e2e/terminal.spec.js`.

The tests are intentionally behavior-first. They verify:

- first-load welcome behavior
- recursive command discovery and grouped help output
- built-in manual lookup
- custom command execution, including nested paths
- unknown command fallback
- root-only client-side persistence across reloads
- `clear` behavior on `/`
- route-driven auto-execution and reset behavior
- invalid non-root routes falling back to the shell instead of a framework 404
- output auto-scroll behavior
- keyboard capture after click-away interactions
- a mobile smoke case

## Data-Driven Command Coverage

The suite reads markdown files directly from:

- `public/commands/custom`
- `public/commands/builtins`

That means:

- every runnable custom command file must execute successfully
- every built-in command doc must be reachable via `man <command>`
- directory-backed manuals such as `<command>/index.md` must be reachable via `man <command>`

If a new command markdown file is added and the runtime does not support it correctly, the suite should fail automatically.

## Why the Test File Repeats Markdown Parsing

The test file has a lightweight copy of the markdown section splitter and assertion-text extractor. This is intentional:

- tests need to inspect command fixtures directly
- Playwright runs in a Node test context, not the browser bundle
- assertions should be driven by the same content contract the app depends on

If the command markdown contract changes, update both:

- `lib/command-markdown.js`
- `tests/e2e/terminal.spec.js`

## Recommended Verification Loop

When changing terminal behavior:

1. Run `npm run test:e2e`.
2. If the issue is visual or interaction-heavy, reproduce it with Playwright rather than guessing from code.
3. Tighten the relevant assertion so the bug is encoded into the suite.

When changing layout or shell internals, prefer assertions around visible user behavior:

- input bar remains in view
- welcome panel appears on correct startup states
- output is restored after reload on `/`
- `clear` on `/` returns the next reload to the welcome screen
- route-derived commands replace visible history on non-root loads
- non-root reloads reset back to the route-derived command only
- typing still lands in the prompt after click-away interactions
