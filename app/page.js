import TerminalShell from '../components/TerminalShell'
import { loadTerminalContent } from '../lib/terminal-content'

export default async function HomePage() {
  const terminalContent = await loadTerminalContent()

  return <TerminalShell {...terminalContent} />
}
