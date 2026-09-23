import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.limnguenfoundation.org';

  // Every public page on the LNF site
  const routes: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }[] = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/programs', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/where-we-work', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/impact', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/partners', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/board-of-directors', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/news', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/resources', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/get-involved', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/donate', priority: 0.9, changeFrequency: 'monthly' },
  ];

  const now = new Date();

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}