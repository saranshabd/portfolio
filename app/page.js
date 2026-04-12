import { renderTerminalPage } from './terminal-page'
import { getRootMetadata } from '../lib/seo'

export async function generateMetadata() {
  return getRootMetadata()
}

export default async function HomePage() {
  return renderTerminalPage()
}
