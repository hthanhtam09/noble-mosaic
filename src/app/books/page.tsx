import type { Metadata } from 'next';
import BookPageClient from './BookPageClient';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Mosaic Color By Number Books',
  description:
    'Browse our complete collection of premium mosaic color by number books. Find the perfect coloring book for relaxation and creative expression.',
  alternates: {
    canonical: 'https://noblemosaic.com/books',
  },
  openGraph: {
    title: 'Mosaic Color By Number Books | Noble Mosaic',
    description:
      'Browse our complete collection of premium mosaic color by number books for adults.',
    url: 'https://noblemosaic.com/books',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mosaic Color By Number Books | Noble Mosaic',
    description:
      'Browse our complete collection of premium mosaic color by number books for adults.',
  },
};

export default function BookPage() {
  return (
    <>
      <CollectionPageJsonLd
        name="Mosaic Color By Number Books"
        description="Browse our complete collection of premium mosaic color by number books. Find the perfect coloring book for relaxation and creative expression."
        url="https://noblemosaic.com/books"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Books', url: 'https://noblemosaic.com/books' },
        ]}
      />
      <BookPageClient />
    </>
  );
}
