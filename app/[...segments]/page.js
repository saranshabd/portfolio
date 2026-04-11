import { renderTerminalPage } from '../terminal-page'

export default async function RoutedTerminalPage({ params }) {
  const resolvedParams = await params

  return renderTerminalPage({
    segments: resolvedParams.segments,
  })
}
