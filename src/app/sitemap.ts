import type { MetadataRoute } from 'next';

const BASE_URL = 'https://novated-lease-calc.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    '',
    '/ev-novated-lease-australia',
    '/fbt-exemption-explained',
    '/novated-vs-cash-vs-loan',
    '/privacy',
    '/terms',
    '/disclosure',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));
}
