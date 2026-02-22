import type { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import ProductDetailClient from './ProductDetailClient';

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

export default function ProductDetailPage({ params }: PageProps) {
  return <ProductDetailClient />;
}
