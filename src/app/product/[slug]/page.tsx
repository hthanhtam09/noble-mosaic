import type { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import ProductDetailClient from './ProductDetailClient';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.',
      };
    }

    const description =
      product.shortDescription ||
      product.description ||
      `${product.title} - Premium mosaic color by number book by Noble Mosaic`;

    return {
      title: product.title,
      description: description.slice(0, 160),
      alternates: {
        canonical: `https://noblemosaic.com/product/${slug}`,
      },
      openGraph: {
        title: `${product.title} | Noble Mosaic`,
        description: description.slice(0, 200),
        url: `https://noblemosaic.com/product/${slug}`,
        type: 'website',
        images: product.coverImage
          ? [
            {
              url: product.coverImage,
              width: 600,
              height: 800,
              alt: product.title,
            },
          ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: description.slice(0, 200),
        images: product.coverImage ? [product.coverImage] : undefined,
      },
    };
  } catch {
    return {
      title: 'Product',
      description: 'Premium mosaic color by number book by Noble Mosaic',
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let productName = 'Product';

  try {
    await connectDB();
    const product = await Product.findOne({ slug }, { title: 1 }).lean();
    if (product) productName = product.title;
  } catch { }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Shop', url: 'https://noblemosaic.com/shop' },
          { name: productName, url: `https://noblemosaic.com/product/${slug}` },
        ]}
      />
      <ProductDetailClient />
    </>
  );
}
