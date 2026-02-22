import type { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import { BlogPost } from '@/models/BlogPost';
import BlogPostClient from './BlogPostClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, published: true }).lean();

    if (!post) {
      return {
        title: 'Blog Post Not Found',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    return {
      title: post.title,
      description: post.excerpt?.slice(0, 160) || `${post.title} - Noble Mosaic Blog`,
      alternates: {
        canonical: `https://noblemosaic.com/blog/${slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt?.slice(0, 200) || post.title,
        url: `https://noblemosaic.com/blog/${slug}`,
        type: 'article',
        publishedTime: post.createdAt?.toISOString(),
        modifiedTime: post.updatedAt?.toISOString(),
        authors: ['Noble Mosaic'],
        section: post.category || 'General',
        images: post.thumbnail
          ? [
              {
                url: post.thumbnail,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt?.slice(0, 200) || post.title,
        images: post.thumbnail ? [post.thumbnail] : undefined,
      },
    };
  } catch {
    return {
      title: 'Blog',
      description: 'Noble Mosaic Blog - Tips, guides, and inspiration for coloring enthusiasts.',
    };
  }
}

export default function BlogPostPage({ params }: PageProps) {
  return <BlogPostClient />;
}
