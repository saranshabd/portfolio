import TerminalShell from '../components/TerminalShell'
import { loadTerminalContent } from '../lib/terminal-content'

function decodeRouteSegments(segments = []) {
  return segments.map((segment) => decodeURIComponent(segment))
}

export async function renderTerminalPage({ segments = [] } = {}) {
  const terminalContent = await loadTerminalContent()
  const normalizedSegments = decodeRouteSegments(segments)
  const initialCommand = normalizedSegments.join(' ').trim()
  const bootMode = normalizedSegments.length > 0 ? 'route' : 'root'

  return (
    <TerminalShell
      {...terminalContent}
      bootMode={bootMode}
      initialCommand={initialCommand}
    />
  )
}
