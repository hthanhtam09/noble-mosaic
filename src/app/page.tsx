import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, ArrowRight, CheckCircle, Palette, Brain, Clock, 
  ExternalLink, Heart, Sparkles, BookOpen, Users
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';

// Featured products data
const featuredProducts = [
  {
    _id: '1',
    title: 'Mosaic Animals Color By Number',
    slug: 'mosaic-animals-color-by-number',
    shortDescription: 'Discover the beauty of wildlife through intricate mosaic designs.',
    theme: 'Animals',
    difficulty: 'beginner',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 127,
    price: '$12.99',
  },
  {
    _id: '2',
    title: 'Floral Mosaic Masterpieces',
    slug: 'floral-mosaic-masterpieces',
    shortDescription: 'A stunning collection of flower mosaic patterns to color.',
    theme: 'Flowers',
    difficulty: 'intermediate',
    coverImage: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?w=400&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 89,
    price: '$14.99',
  },
  {
    _id: '3',
    title: 'Mandala Mosaic Journey',
    slug: 'mandala-mosaic-journey',
    shortDescription: 'Find inner peace with mesmerizing mandala mosaic designs.',
    theme: 'Mandala',
    difficulty: 'advanced',
    coverImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 156,
    price: '$15.99',
  },
  {
    _id: '4',
    title: 'Nature Patterns Mosaic',
    slug: 'nature-patterns-mosaic',
    shortDescription: 'Explore the natural world through beautiful mosaic art.',
    theme: 'Nature',
    difficulty: 'beginner',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
    rating: 4.6,
    reviewCount: 78,
    price: '$11.99',
  },
];

const benefits = [
  {
    icon: Brain,
    title: 'Stress Relief',
    description: 'Coloring reduces anxiety and promotes relaxation. Let your worries fade with each stroke.',
    color: 'var(--mosaic-coral)',
  },
  {
    icon: Palette,
    title: 'Creative Expression',
    description: 'Express yourself through color while following numbered guides for stunning results.',
    color: 'var(--mosaic-purple)',
  },
  {
    icon: Clock,
    title: 'Mindful Moments',
    description: 'Take a break from screens and enjoy therapeutic coloring sessions.',
    color: 'var(--mosaic-teal)',
  },
  {
    icon: CheckCircle,
    title: 'Quality Designs',
    description: 'Professionally designed mosaic patterns printed on premium paper.',
    color: 'var(--mosaic-gold)',
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Choose Your Book',
    description: 'Browse our collection and find the perfect mosaic coloring book.',
    color: 'var(--mosaic-coral)',
  },
  {
    step: '2',
    title: 'Order on Amazon',
    description: 'Purchase securely through Amazon for fast delivery.',
    color: 'var(--mosaic-teal)',
  },
  {
    step: '3',
    title: 'Start Coloring',
    description: 'Follow the color-by-number guide and create beautiful art!',
    color: 'var(--mosaic-purple)',
  },
];

const colorPalette = [
  { name: 'Coral', color: 'var(--mosaic-coral)' },
  { name: 'Gold', color: 'var(--mosaic-gold)' },
  { name: 'Teal', color: 'var(--mosaic-teal)' },
  { name: 'Purple', color: 'var(--mosaic-purple)' },
  { name: 'Rose', color: 'var(--mosaic-rose)' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative mosaic-hero overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-2xl bg-[var(--mosaic-coral)] opacity-10 rotate-12 animate-float" />
          <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-[var(--mosaic-teal)] opacity-10 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-3xl bg-[var(--mosaic-purple)] opacity-10 -rotate-12 animate-float" style={{ animationDelay: '2s' }} />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center max-w-3xl mx-auto">
              {/* Color palette indicator */}
              <div className="flex justify-center gap-2 mb-6">
                {colorPalette.map((item, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full shadow-md"
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              </div>
              
              <Badge 
                variant="outline" 
                className="mb-6 px-4 py-1.5 border-2 text-neutral-700 rounded-full"
              >
                <Sparkles className="h-4 w-4 mr-2 text-[var(--mosaic-gold)]" />
                Premium Color By Number Books
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-neutral-900 mb-6">
                Relax. Focus.{' '}
                <span className="bg-gradient-to-r from-[var(--mosaic-coral)] via-[var(--mosaic-purple)] to-[var(--mosaic-teal)] bg-clip-text text-transparent">
                  Create.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Discover the therapeutic art of mosaic color by number. Beautiful designs that help you 
                unwind, express creativity, and find moments of peace.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white px-8 rounded-full shadow-xl shadow-neutral-800/20"
                >
                  <Link href="/shop">
                    View Books
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-2 rounded-full px-8"
                >
                  <Link href="/free-downloads">
                    <Heart className="mr-2 h-5 w-5 text-[var(--mosaic-rose)]" />
                    Get Free Pages
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="mt-12 flex justify-center gap-8 md:gap-12">
                <div className="text-center">
                  <p className="text-3xl font-bold text-neutral-900">50+</p>
                  <p className="text-sm text-neutral-500">Designs per book</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-neutral-900">10k+</p>
                  <p className="text-sm text-neutral-500">Happy colorists</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-neutral-900">4.8</p>
                  <p className="text-sm text-neutral-500">Average rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Books */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex justify-center gap-2 mb-4">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-5 w-5 text-[var(--mosaic-gold)] fill-[var(--mosaic-gold)]" />
                ))}
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4">
                Featured Books
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Explore our most loved mosaic coloring books, designed for relaxation and creative joy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-2 rounded-full px-8"
              >
                <Link href="/shop">
                  View All Books
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Noble Mosaic */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-neutral-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4">
                Why Noble Mosaic?
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Our coloring books are crafted with care to provide the best relaxation experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card 
                  key={index} 
                  className="mosaic-card border-0 shadow-sm bg-white"
                >
                  <CardContent className="p-6 text-center">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
                      style={{ backgroundColor: benefit.color }}
                    >
                      <benefit.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-neutral-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Getting started with Noble Mosaic is simple.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div 
                    className="text-7xl md:text-8xl font-serif font-bold opacity-10 mb-4"
                    style={{ color: item.color }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{item.title}</h3>
                  <p className="text-neutral-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Amazon CTA */}
        <section className="py-16 lg:py-24 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--mosaic-purple)] via-[var(--mosaic-coral)] to-[var(--mosaic-gold)]" />
          <div className="absolute inset-0 bg-[url('/logo.svg')] bg-repeat opacity-5" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto text-white">
              <div className="flex justify-center gap-2 mb-6">
                {colorPalette.map((item, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-lg bg-white/30 backdrop-blur-sm"
                  />
                ))}
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Ready to Start Your Creative Journey?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                All our books are available on Amazon. Fast shipping, secure checkout.
              </p>
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-neutral-900 hover:bg-neutral-100 px-8 rounded-full shadow-xl"
              >
                <a 
                  href="https://amazon.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Shop on Amazon
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <p className="mt-4 text-sm text-white/70">
                Secure checkout via Amazon
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
