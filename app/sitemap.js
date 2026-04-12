import { getIndexableRoutes, getSiteUrl } from '../lib/seo'

export default async function sitemap() {
  const siteUrl = getSiteUrl()
  const routes = await getIndexableRoutes()

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }))
}
