import type { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Blog - Tips, Guides & Coloring Inspiration',
  description:
    'Read the latest articles about mosaic coloring, mindfulness techniques, creative tips, and coloring book reviews. Get inspired and learn new coloring techniques.',
  alternates: {
    canonical: 'https://noblemosaic.com/blog',
  },
  openGraph: {
    title: 'Blog - Tips, Guides & Coloring Inspiration | Noble Mosaic',
    description:
      'Read the latest articles about mosaic coloring, mindfulness techniques, and creative tips for adult coloring enthusiasts.',
    url: 'https://noblemosaic.com/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Tips, Guides & Coloring Inspiration | Noble Mosaic',
    description:
      'Read the latest articles about mosaic coloring, mindfulness techniques, and creative tips.',
  },
};

export default function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Blog', url: 'https://noblemosaic.com/blog' },
        ]}
      />
      <BlogPageClient />
    </>
  );
}
