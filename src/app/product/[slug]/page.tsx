import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink, Shield, Truck, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import APlusContent from '@/components/aplus/APlusContent';

// Sample product data
const sampleProduct = {
  _id: '1',
  title: 'Mosaic Animals Color By Number',
  slug: 'mosaic-animals-color-by-number',
  description: 'Immerse yourself in the captivating world of mosaic art with our premium color by number book featuring stunning animal designs. Each page presents a unique wildlife scene transformed into an intricate mosaic pattern, waiting for you to bring it to life with color. Perfect for adults seeking relaxation, stress relief, and creative expression.',
  shortDescription: 'Discover the beauty of wildlife through intricate mosaic designs.',
  theme: 'Animals',
  difficulty: 'beginner',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1200&fit=crop',
  galleryImages: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800&h=1200&fit=crop',
  ],
  amazonLink: 'https://amazon.com/dp/example',
  bulletPoints: [
    '50+ unique animal mosaic designs ranging from simple to complex',
    'Single-sided printing to prevent bleed-through',
    'Large 8.5" x 11" format for detailed coloring',
    'Premium quality paper suitable for colored pencils and markers',
    'Includes color guide and testing pages',
    'Perfect for beginners and experienced colorists alike',
  ],
  aPlusContent: [
    {
      type: 'fullWidth' as const,
      title: 'Transform Your Relaxation Time',
      content: 'Discover the therapeutic benefits of mosaic coloring and create stunning artwork you\'ll be proud to display.',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=600&fit=crop',
    },
    {
      type: 'featureHighlight' as const,
      title: 'What Makes Our Books Special',
      items: [
        { title: 'Premium Paper', description: 'Thick, acid-free paper that prevents bleed-through and stands up to erasing.', icon: '📄' },
        { title: 'Unique Designs', description: 'Original artwork you won\'t find anywhere else, created by professional artists.', icon: '🎨' },
        { title: 'Color Guides', description: 'Each design includes a suggested color palette to help you get started.', icon: '🎯' },
      ],
    },
    {
      type: 'twoColumn' as const,
      title: 'Perfect for Mindful Coloring',
      content: 'Our mosaic designs are specifically crafted to promote mindfulness and relaxation. The numbered sections help guide your color choices while still allowing for creative expression. Studies have shown that coloring can reduce anxiety and improve focus, making this book an ideal companion for your self-care routine.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop',
    },
    {
      type: 'previewGrid' as const,
      title: 'Inside the Book',
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400&h=400&fit=crop',
      ],
    },
    {
      type: 'lifestyle' as const,
      title: 'Your Creative Sanctuary Awaits',
      content: 'Set aside time for yourself and discover the joy of creating beautiful mosaic art.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=500&fit=crop',
    },
  ],
  rating: 4.8,
  reviewCount: 127,
  price: '$12.99',
};

const relatedProducts = [
  {
    _id: '2',
    title: 'Floral Mosaic Masterpieces',
    slug: 'floral-mosaic-masterpieces',
    coverImage: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?w=400&h=600&fit=crop',
    price: '$14.99',
    rating: 4.9,
  },
  {
    _id: '3',
    title: 'Mandala Mosaic Journey',
    slug: 'mandala-mosaic-journey',
    coverImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=600&fit=crop',
    price: '$15.99',
    rating: 4.7,
  },
  {
    _id: '4',
    title: 'Nature Patterns Mosaic',
    slug: 'nature-patterns-mosaic',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
    price: '$11.99',
    rating: 4.6,
  },
];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // In a real app, you would fetch the product based on the slug
  const product = sampleProduct;

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
              <Link href="/" className="hover:text-neutral-700">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-neutral-700">Shop</Link>
              <span>/</span>
              <span className="text-neutral-900">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100">
                  <Image
                    src={product.coverImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-2">
                  {product.galleryImages.map((image, index) => (
                    <button
                      key={index}
                      className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 border-2 border-transparent hover:border-neutral-300 transition-colors"
                    >
                      <Image
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Product Info */}
              <div className="lg:pl-4">
                {/* Title & Subtitle */}
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900">
                  {product.title}
                </h1>
                <p className="mt-2 text-neutral-600">
                  {product.shortDescription}
                </p>

                {/* Rating */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating || 4.5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mt-4">
                  <span className="text-3xl font-bold text-neutral-900">{product.price}</span>
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-stone-100 text-neutral-700">
                    {product.theme}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {product.difficulty}
                  </Badge>
                </div>

                {/* Bullet Points */}
                <div className="mt-6">
                  <ul className="space-y-2">
                    {product.bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-neutral-600">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="mt-8 space-y-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <a
                      href={product.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      Buy on Amazon
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <p className="text-xs text-center text-neutral-500 flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    Secure checkout via Amazon
                  </p>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 p-4 bg-stone-50 rounded-lg">
                  <div className="flex items-center gap-3 text-sm text-neutral-600">
                    <Truck className="h-5 w-5" />
                    <span>Fast shipping available via Amazon Prime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* A+ Content Section */}
        <div className="bg-stone-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            {product.aPlusContent.map((block, index) => (
              <APlusContent key={index} block={block} />
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white border-t border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100">
                    <Image
                      src={relatedProduct.coverImage}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="mt-3 font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors">
                    {relatedProduct.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{relatedProduct.price}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-neutral-600 ml-1">{relatedProduct.rating}</span>
                    </div>
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
