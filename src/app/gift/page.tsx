import type { Metadata } from 'next';
import GiftPageClient from './GiftPageClient';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Free Coloring Pages - Gift',
  description:
    'Download free mosaic coloring pages from Noble Mosaic. Subscribe with your email to unlock beautiful printable color by number pages for adults.',
  alternates: {
    canonical: 'https://noblemosaic.com/gift',
  },
  openGraph: {
    title: 'Free Coloring Pages - Gift | Noble Mosaic',
    description:
      'Download free mosaic coloring pages. Subscribe to unlock beautiful printable color by number pages.',
    url: 'https://noblemosaic.com/gift',
    type: 'website',
  },
};

export default function GiftPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Gift', url: 'https://noblemosaic.com/gift' },
        ]}
      />
      <GiftPageClient />
    </>
  );
}
