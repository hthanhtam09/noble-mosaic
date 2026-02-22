'use client';

import { useBlogPost } from '@/hooks/api/useBlog';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft, Facebook, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category: string;
}

export default function BlogPostClient() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data, isLoading, isError: notFound } = useBlogPost(slug);
  const post = data?.post || null;
  const relatedPosts = data?.relatedPosts || [];

  // Estimate read time from content
  const readTime = post ? `${Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200))} min read` : '';

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-neutral-400" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-4">Post Not Found</h1>
          <p className="text-neutral-500 mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild variant="outline">
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Structured Data */}
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt || ''}
        image={post.thumbnail}
        url={`https://noblemosaic.com/blog/${post.slug}`}
        datePublished={post.createdAt}
        dateModified={post.createdAt}
        category={post.category}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Blog', url: 'https://noblemosaic.com/blog' },
          { name: post.title, url: `https://noblemosaic.com/blog/${post.slug}` },
        ]}
      />

      <Header />
      
      <main className="flex-grow bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-neutral-100">
          <div className="mx-auto max-w-4xl px-4 md:px-8 lg:px-16 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-neutral-500">
              <Link href="/" className="hover:text-neutral-700">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-neutral-700">Blog</Link>
              <span>/</span>
              <span className="text-neutral-900 line-clamp-1">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <div className="mx-auto max-w-4xl px-4 md:px-8 lg:px-16 py-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <Badge variant="secondary" className="bg-stone-100 text-neutral-700 mb-4">
            {post.category}
          </Badge>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-neutral-600 mb-6">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-neutral-100">
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.thumbnail && (
          <div className="mx-auto max-w-4xl px-4 md:px-8 lg:px-16 mb-8">
            <div className="relative aspect-[21/9] rounded-xl overflow-hidden">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="mx-auto max-w-4xl px-4 md:px-8 lg:px-16">
          <article className="prose prose-lg prose-neutral max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: (post.content || '')
                  .replace(/## (.*)/g, '<h2 class="text-2xl font-serif font-bold text-neutral-900 mt-8 mb-4">$1</h2>')
                  .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-neutral-900 mt-6 mb-3">$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/- \*\*(.*?)\*\* - (.*)/g, '<li class="mb-2"><strong>$1</strong> - $2</li>')
                  .replace(/- (.*)/g, '<li class="mb-2">$1</li>')
                  .replace(/(\d+)\. \*\*(.*?)\*\* - (.*)/g, '<li class="mb-2"><strong>$2</strong> - $3</li>')
                  .replace(/\n\n/g, '</p><p class="text-neutral-600 leading-relaxed mb-4">')
                  .replace(/^(.+)$/gm, '<p class="text-neutral-600 leading-relaxed mb-4">$1</p>')
              }} 
            />
          </article>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-neutral-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Share this article</h3>
                <div className="flex gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://noblemosaic.com/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                  >
                    <Facebook className="h-5 w-5 text-neutral-700" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=https://noblemosaic.com/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                    className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-neutral-700" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=https://noblemosaic.com/blog/${post.slug}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-neutral-700" />
                  </a>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/shop">Explore Our Books</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-stone-50 mt-12">
            <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-12">
              <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-6">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost._id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {relatedPost.thumbnail && (
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={relatedPost.thumbnail}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <Badge variant="secondary" className="bg-stone-100 text-neutral-700 mb-2">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
