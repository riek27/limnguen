import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.suddenvironmentagency.org'

  // Add all your main static pages here
  const routes = [
    '',
    '/about',
    '/programs',
    '/impact',
    '/projects',
    '/news',
    '/partners',
    '/get-involved',
    '/contact',
    '/donate',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  return routes
}