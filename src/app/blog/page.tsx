import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    _id: '1',
    title: 'The Science Behind Coloring and Stress Relief',
    slug: 'science-behind-coloring-stress-relief',
    excerpt: 'Discover how the simple act of coloring can significantly reduce stress and anxiety levels, backed by scientific research.',
    thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=500&fit=crop',
    category: 'Wellness',
    createdAt: '2024-01-15',
    readTime: '5 min read',
  },
  {
    _id: '2',
    title: '10 Tips for Beginners Starting Color By Number',
    slug: 'tips-beginners-color-by-number',
    excerpt: 'New to color by number? Here are our top tips to help you get started and make the most of your coloring experience.',
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=500&fit=crop',
    category: 'Tips & Tricks',
    createdAt: '2024-01-10',
    readTime: '4 min read',
  },
  {
    _id: '3',
    title: 'Creating a Relaxing Coloring Space at Home',
    slug: 'creating-relaxing-coloring-space',
    excerpt: 'Transform a corner of your home into the perfect sanctuary for mindful coloring sessions.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
    category: 'Lifestyle',
    createdAt: '2024-01-05',
    readTime: '6 min read',
  },
  {
    _id: '4',
    title: 'Color Psychology: Choosing the Right Palette',
    slug: 'color-psychology-choosing-palette',
    excerpt: 'Learn how different colors affect your mood and how to choose the perfect palette for your coloring projects.',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=500&fit=crop',
    category: 'Creative',
    createdAt: '2023-12-28',
    readTime: '7 min read',
  },
  {
    _id: '5',
    title: 'Mindful Coloring: A Daily Practice for Peace',
    slug: 'mindful-coloring-daily-practice',
    excerpt: 'How to incorporate coloring into your daily mindfulness routine for lasting benefits.',
    thumbnail: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=500&fit=crop',
    category: 'Wellness',
    createdAt: '2023-12-20',
    readTime: '5 min read',
  },
  {
    _id: '6',
    title: 'Best Colored Pencils for Adult Coloring Books',
    slug: 'best-colored-pencils-adult-coloring',
    excerpt: 'A comprehensive guide to choosing the right colored pencils for your mosaic coloring projects.',
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=500&fit=crop',
    category: 'Tools & Supplies',
    createdAt: '2023-12-15',
    readTime: '8 min read',
  },
];

const categories = ['All', 'Wellness', 'Tips & Tricks', 'Lifestyle', 'Creative', 'Tools & Supplies'];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-stone-50">
        {/* Page Header */}
        <div className="bg-white border-b border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900">
              Blog
            </h1>
            <p className="mt-2 text-neutral-600">
              Insights, tips, and inspiration for your coloring journey
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'All'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-12">
            <Link href={`/blog/${blogPosts[0].slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-6 bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="relative aspect-[16/10] md:aspect-auto">
                  <Image
                    src={blogPosts[0].thumbnail}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-4 bg-stone-100 text-neutral-700">
                    {blogPosts[0].category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors mb-3">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(blogPosts[0].createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {blogPosts[0].readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
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
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
