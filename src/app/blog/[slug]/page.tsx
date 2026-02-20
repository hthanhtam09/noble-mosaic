import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

const blogPost = {
  _id: '1',
  title: 'The Science Behind Coloring and Stress Relief',
  slug: 'science-behind-coloring-stress-relief',
  excerpt: 'Discover how the simple act of coloring can significantly reduce stress and anxiety levels, backed by scientific research.',
  content: `
## Understanding the Connection Between Coloring and Relaxation

In our fast-paced modern world, finding effective ways to manage stress has become more important than ever. While many turn to meditation, exercise, or therapy, a surprisingly powerful tool has been gaining recognition: adult coloring.

### The Neuroscience of Coloring

When you color, something remarkable happens in your brain. The activity engages both the logical and creative hemispheres, creating a meditative state that researchers have found can:

- **Reduce cortisol levels** - The primary stress hormone decreases during coloring sessions
- **Lower blood pressure** - Regular coloring has been linked to improved cardiovascular health
- **Activate the amygdala** - The brain's fear center becomes less active, reducing anxiety

A study published in the Journal of the American Art Therapy Association found that just 20 minutes of coloring can significantly lower stress levels, comparable to the effects of a short meditation session.

### Why Color by Number is Particularly Effective

Color by number books, like our mosaic designs, offer unique benefits:

1. **Structured creativity** - The numbered guide provides a framework that reduces decision fatigue
2. **Sense of accomplishment** - Completing each section gives a small dopamine boost
3. **Focus enhancement** - The detailed patterns require sustained attention, improving concentration
4. **Predictable outcomes** - Knowing the final result will be beautiful reduces performance anxiety

### Creating Your Coloring Routine

To maximize the stress-relief benefits, consider these tips:

**Set a regular time** - Whether it's 15 minutes in the morning or an hour before bed, consistency helps your brain associate coloring with relaxation.

**Create a dedicated space** - Having a comfortable, well-lit area with all your supplies ready removes barriers to starting.

**Choose the right complexity** - Match the difficulty level to your energy and time. Sometimes a simple design is exactly what you need.

**Embrace imperfection** - The goal is relaxation, not perfection. If you color outside the lines or choose an unexpected color, that's part of the creative journey.

### The Ripple Effects of Regular Coloring

Beyond the immediate stress relief, people who color regularly report:

- Better sleep quality
- Improved hand-eye coordination
- Enhanced problem-solving abilities
- Greater overall life satisfaction
- A renewed sense of creativity

### Getting Started

If you're new to adult coloring, start with a beginner-friendly book with larger sections. Our mosaic color by number books are designed to guide you through increasingly complex designs as your confidence grows.

Remember, the journey is just as important as the destination. Each colored section is a moment of mindfulness you've gifted yourself.
  `,
  thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=600&fit=crop',
  category: 'Wellness',
  createdAt: '2024-01-15',
  readTime: '5 min read',
  author: {
    name: 'Sarah Mitchell',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
};

const relatedPosts = [
  {
    _id: '2',
    title: '10 Tips for Beginners Starting Color By Number',
    slug: 'tips-beginners-color-by-number',
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=300&fit=crop',
    category: 'Tips & Tricks',
  },
  {
    _id: '3',
    title: 'Creating a Relaxing Coloring Space at Home',
    slug: 'creating-relaxing-coloring-space',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    category: 'Lifestyle',
  },
  {
    _id: '4',
    title: 'Color Psychology: Choosing the Right Palette',
    slug: 'color-psychology-choosing-palette',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop',
    category: 'Creative',
  },
];

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // In a real app, you would fetch the post based on the slug
  const post = blogPost;

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-neutral-100">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
              <Link href="/" className="hover:text-neutral-700">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-neutral-700">Blog</Link>
              <span>/</span>
              <span className="text-neutral-900 line-clamp-1">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-neutral-900">{post.author.name}</span>
            </div>
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
                {post.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-8">
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

        {/* Article Content */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg prose-neutral max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .replace(/##\s(.*)/g, '<h2 class="text-2xl font-serif font-bold text-neutral-900 mt-8 mb-4">$1</h2>')
                  .replace(/###\s(.*)/g, '<h3 class="text-xl font-semibold text-neutral-900 mt-6 mb-3">$1</h3>')
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
                  <button className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
                    <Facebook className="h-5 w-5 text-neutral-700" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
                    <Twitter className="h-5 w-5 text-neutral-700" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
                    <Linkedin className="h-5 w-5 text-neutral-700" />
                  </button>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/shop">Explore Our Books</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="bg-stone-50 mt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
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
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={relatedPost.thumbnail}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
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
      </main>
      
      <Footer />
    </div>
  );
}
