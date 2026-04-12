import TerminalShell from '../components/TerminalShell'
import { loadTerminalContent } from '../lib/terminal-content'

function decodeRouteSegments(segments = []) {
  return segments.map((segment) => decodeURIComponent(segment))
}

export async function renderTerminalPage({ segments = [] } = {}) {
  const terminalContent = await loadTerminalContent()
  const normalizedSegments = decodeRouteSegments(segments)
  const routePath = normalizedSegments.join('/').trim().toLowerCase()
  const initialCommand = normalizedSegments.join(' ').trim()
  const bootMode = normalizedSegments.length > 0 ? 'route' : 'root'
  const matchedContentEntry = terminalContent.contentEntries.find(
    (entry) => entry.name === routePath
  )
  const bootCommand = matchedContentEntry ? `cat ${matchedContentEntry.name}` : initialCommand

  return (
    <TerminalShell
      {...terminalContent}
      bootMode={bootMode}
      initialCommand={bootCommand}
      isContentRoute={Boolean(matchedContentEntry)}
    />
  )
}
