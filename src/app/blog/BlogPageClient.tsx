'use client';

import { useState, useEffect } from 'react';
import { useBlogPosts } from '@/hooks/api/useBlog';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { CollectionPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export default function BlogPageClient() {
  const { data: posts = [], isLoading } = useBlogPosts();

  const [displayLimit, setDisplayLimit] = useState(7); // 1 featured + 6 regular

  const categories = ['All', ...new Set(posts.map(p => p.category).filter(Boolean))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayLimit(7);
  }, [selectedCategory]);

  const filteredPosts = posts.filter(post =>
    selectedCategory === 'All' || post.category === selectedCategory
  );
  const displayedPosts = filteredPosts.slice(0, displayLimit);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Structured Data */}
      <CollectionPageJsonLd
        name="Noble Mosaic Blog"
        description="Articles about mosaic coloring, mindfulness, and creative tips for adult coloring enthusiasts."
        url="https://noblemosaic.com/blog"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Blog', url: 'https://noblemosaic.com/blog' },
        ]}
      />

      <Header />

      <main className="flex-grow bg-stone-50">
        <div className="layout-inner py-8">
          {/* SEO heading */}
          <h1 className="sr-only">Noble Mosaic Blog - Coloring Tips & Inspiration</h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-500 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Categories */}
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === selectedCategory
                          ? 'bg-neutral-900 text-white'
                          : 'bg-white text-neutral-600 hover:bg-neutral-100'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {/* Featured Post */}
              {displayedPosts.length > 0 && (
                <div className="mb-12">
                  <Link href={`/blog/${displayedPosts[0].slug}`} className="group block">
                    <div className="grid md:grid-cols-2 gap-6 bg-white rounded-xl overflow-hidden shadow-sm">
                      {displayedPosts[0].thumbnail && (
                        <div className="relative aspect-[16/10] md:aspect-auto">
                          <Image
                            src={displayedPosts[0].thumbnail}
                            alt={displayedPosts[0].title}
                            fill
                            priority
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      )}
                      <div className="p-6 md:p-8 flex flex-col justify-center">
                        <Badge variant="secondary" className="w-fit mb-4 bg-stone-100 text-neutral-700">
                          {displayedPosts[0].category}
                        </Badge>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors mb-3">
                          {displayedPosts[0].title}
                        </h2>
                        <p className="text-neutral-600 mb-4">
                          {displayedPosts[0].excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(displayedPosts[0].createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Posts Grid */}
              {displayedPosts.length > 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPosts.slice(1).map((post) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {post.thumbnail && (
                        <div className="relative aspect-[16/10]">
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <Badge variant="secondary" className="bg-stone-100 text-neutral-700 mb-3">
                          {post.category}
                        </Badge>
                        <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-neutral-900 group-hover:text-neutral-700 flex items-center gap-1">
                            Read
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {filteredPosts.length > displayLimit && (
                <div className="mt-12 flex justify-center">
                  <Button
                    onClick={() => setDisplayLimit(prev => prev + 6)}
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 bg-white hover:bg-neutral-50"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
