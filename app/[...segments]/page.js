import { renderTerminalPage } from '../terminal-page'
import { getRouteMetadata } from '../../lib/seo'

export async function generateMetadata({ params }) {
  const resolvedParams = await params

  return getRouteMetadata(resolvedParams.segments)
}

export default async function RoutedTerminalPage({ params }) {
  const resolvedParams = await params

  return renderTerminalPage({
    segments: resolvedParams.segments,
  })
}
