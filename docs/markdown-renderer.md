# Markdown Renderer

## Purpose

All visible command content is authored as markdown, but it should render like native terminal output rather than a blog post page. `components/MarkdownRenderer.js` is the conversion layer that makes that possible.

## Rendering Stack

The renderer uses:

- `react-markdown` for markdown-to-React conversion
- `remark-gfm` for GitHub-flavored markdown support

That gives support for common markdown authoring patterns like:

- headings
- emphasis
- lists
- inline code
- fenced code blocks
- links

## Terminal-Native Overrides

The renderer customizes a small set of elements so markdown output matches the shell aesthetic.

### Links

Anchor tags are overridden to:

- apply terminal link styling
- open external `http` links in a new tab
- keep internal links in the same browsing context

### Code

Code rendering is split into:

- inline code: styled like terminal inline snippets
- block code: styled with a darker panel and monospaced presentation

This is handled by checking the `inline` flag in the custom code renderer.

## Styling Boundary

The renderer itself stays small. Most presentation lives in `app/globals.css` under:

- `.terminal-markdown`
- `.terminal-markdown__link`
- `.terminal-markdown__inline-code`
- `.terminal-markdown__code-block`

This separation keeps markdown rendering logic simple while allowing visual tuning in CSS.

## Why the Renderer Accepts Raw Markdown Strings

Terminal entries store plain strings rather than React nodes. This makes the shell state portable and persistable:

- welcome content can be restored from persisted history
- command output can be generated from markdown files
- unknown command errors can be created as markdown strings in code

The renderer is the final step that converts those strings into visible output.
