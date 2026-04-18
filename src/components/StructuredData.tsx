import { FAQ_ITEMS } from '@/lib/faq-items';

const BASE_URL = 'https://novated-lease-calc.vercel.app';

export function StructuredData() {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NovaLease — Australian Novated Lease Calculator',
    url: BASE_URL,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    description:
      'Free Australian novated lease calculator. Compares EV FBT-exempt leases, standard novated leases with ECM, buying with cash, and car loans. FY2025-26 rates.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
    inLanguage: 'en-AU',
    audience: { '@type': 'Audience', geographicArea: { '@type': 'Country', name: 'Australia' } },
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NovaLease',
    url: BASE_URL,
    description: 'Independent Australian novated lease comparison tool.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
    </>
  );
}
