import type { Metadata } from 'next';
import ShopPageClient from './ShopPageClient';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Shop All Coloring Books',
  description:
    'Browse our complete collection of premium mosaic color by number books. Filter by theme, difficulty, and find the perfect coloring book for relaxation and creative expression.',
  alternates: {
    canonical: 'https://noblemosaic.com/books',
  },
  openGraph: {
    title: 'Shop All Coloring Books | Noble Mosaic',
    description:
      'Browse our complete collection of premium mosaic color by number books for adults. Animals, flowers, mandalas, and more.',
    url: 'https://noblemosaic.com/books',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Coloring Books | Noble Mosaic',
    description:
      'Browse our complete collection of premium mosaic color by number books for adults.',
  },
};

export default function ShopPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Books', url: 'https://noblemosaic.com/books' },
        ]}
      />
      <ShopPageClient />
    </>
  );
}
