# Testing

## Test Strategy

The repository uses Playwright for end-to-end browser coverage in `tests/e2e/terminal.spec.js`.

The tests are intentionally behavior-first. They verify:

- first-load welcome behavior
- command discovery and help output
- built-in manual lookup
- custom command execution
- unknown command fallback
- client-side persistence across reloads
- `clear` behavior
- output auto-scroll behavior
- keyboard capture after click-away interactions
- a mobile smoke case

## Data-Driven Command Coverage

The suite reads markdown files directly from:

- `public/commands/custom`
- `public/commands/builtins`

That means:

- every custom command file must execute successfully
- every built-in command doc must be reachable via `man <command>`

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
- output is restored after reload
- typing still lands in the prompt after click-away interactions
