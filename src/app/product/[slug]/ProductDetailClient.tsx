'use client';

import { useState, useRef } from 'react';
import { useProduct } from '@/hooks/api/useProducts';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  ExternalLink,
  Shield,
  Truck,
  Check,
  Loader2,
  Clock,
  BarChart3,
  Grid3X3,
  Maximize,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import {
  ProductJsonLd,
  BreadcrumbJsonLd,
} from '@/components/seo/JsonLd';

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  theme: string;
  difficulty: string;
  coverImage: string;
  galleryImages: string[];
  amazonLink: string;
  bulletPoints: string[];
  aPlusContent: {
    type: 'fullWidth' | 'twoColumn' | 'featureHighlight' | 'lifestyle';
    title?: string;
    content?: string;
    image?: string;
    images?: string[];
    items?: { title: string; description: string; icon?: string }[];
  }[];
  rating?: number;
  reviewCount?: number;
  price?: string;
}

interface RelatedProduct {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  price?: string;
  rating?: number;
}

// Feature icons data
const featureIcons = [
  { icon: Clock, label: 'Coloring Time', sublabel: '~1h 50min' },
  { icon: BarChart3, label: 'Difficulty', sublabel: 'Intermediate' },
  { icon: Grid3X3, label: 'Cell Size', sublabel: '5×5mm' },
  { icon: Maximize, label: 'Bold Lines', sublabel: 'Easy to see' },
];

export default function ProductDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, isError: notFound } = useProduct(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const product = data?.product || null;
  const relatedProducts = data?.relatedProducts || [];

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // All images (cover + gallery)
  const allImages = product
    ? [product.coverImage, ...(product.galleryImages || [])]
    : [];

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

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-4">Product Not Found</h1>
          <p className="text-neutral-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild variant="outline">
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }



  return (
    <div className="min-h-screen flex flex-col">
      {/* Structured Data */}
      <ProductJsonLd
        name={product.title}
        description={product.shortDescription || product.description || ''}
        image={product.coverImage}
        url={`https://noblemosaic.com/product/${product.slug}`}
        price={product.price != null ? String(product.price) : undefined}
        rating={product.rating}
        reviewCount={product.reviewCount}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Shop', url: 'https://noblemosaic.com/shop' },
          {
            name: product.title,
            url: `https://noblemosaic.com/product/${product.slug}`,
          },
        ]}
      />

      <Header />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-neutral-500">
              <Link href="/" className="hover:text-neutral-700 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-neutral-700 transition-colors">Shop</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 1: Hero — Product Images + Info                       */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-8 lg:py-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
              {/* Left: Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="product-image-border relative aspect-[3/4] bg-neutral-50">
                  <Image
                    src={allImages[selectedImage] || product.coverImage}
                    alt={`${product.title} - Mosaic Color By Number Book`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>

                {/* Thumbnail Strip */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedImage === index
                            ? 'product-thumb-active shadow-md'
                            : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Info */}
              <div className="lg:pl-2 flex flex-col">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-neutral-900 leading-tight">
                  {product.title}
                </h1>

                {/* Coming soon badge (if no amazonLink or placeholder) */}
                {product.galleryImages && product.galleryImages.length > 0 && (
                  <div className="mt-4 flex items-start gap-3">
                    <Badge className="bg-green-600 text-white text-xs px-3 py-1">
                      Available Now
                    </Badge>
                    <div className="relative w-12 h-16 rounded-md overflow-hidden border border-neutral-200 shadow-sm">
                      <Image
                        src={product.galleryImages[0]}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="mt-4 text-neutral-600 leading-relaxed text-sm md:text-base">
                  {product.shortDescription || product.description}
                </p>

                {/* What makes it special? */}
                {product.bulletPoints && product.bulletPoints.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
                      What makes it special?
                    </h3>
                    <ul className="space-y-2">
                      {product.bulletPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-sm text-neutral-600">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rating */}
                {product.rating && (
                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-lg font-bold text-neutral-900">
                      {product.rating}
                    </span>
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
                    {product.reviewCount && (
                      <span className="text-sm text-neutral-500">
                        ({product.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                {product.price && (
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-neutral-900">{product.price}</span>
                  </div>
                )}

                {/* Spacer to push CTA down */}
                <div className="flex-grow min-h-4" />

                {/* CTA Section */}
                <div className="mt-6 space-y-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white text-base font-semibold rounded-xl h-14 shadow-lg shadow-amber-500/20 btn-mosaic"
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

                  <p className="text-xs text-center text-neutral-500 flex items-center justify-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    Secure checkout via Amazon
                  </p>

                  <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg text-sm text-neutral-600">
                    <Truck className="h-5 w-5 flex-shrink-0" />
                    <span>Fast shipping available via Amazon Prime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 2: Feature Icons Row                                  */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-white border-t border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-8">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {featureIcons.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="feature-icon-circle">
                    <feature.icon className="h-6 w-6 text-neutral-700" />
                  </div>
                  <span className="mt-2 text-xs font-medium text-neutral-900">{feature.label}</span>
                  <span className="text-xs text-neutral-500">{feature.sublabel}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 3: "What's inside?" — Specs + Preview Grid            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-stone-50">
          <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 text-center mb-12">
              What&apos;s inside?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
              {/* Specs Card */}
              <div className="spec-card">
                <div className="grid grid-cols-2 gap-6">
                  <div className="spec-item flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="spec-number">34</span>
                      <span className="spec-label text-xs">Hidden</span>
                    </div>
                    <span className="spec-label">Images</span>
                  </div>
                  <div className="spec-item flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="spec-number">15</span>
                      <span className="spec-label text-xs">Vibrant</span>
                    </div>
                    <span className="spec-label">Colors</span>
                  </div>
                  <div className="spec-item flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="spec-number">5</span>
                      <span className="spec-label text-xs">Unique</span>
                    </div>
                    <span className="spec-label">Backgrounds</span>
                  </div>
                  <div className="spec-item flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="spec-number text-2xl">8.5×11&quot;</span>
                    </div>
                    <span className="spec-label">Large Print</span>
                  </div>
                </div>
              </div>

              {/* Preview stack / description */}
              <div className="flex flex-col items-center justify-center">
                {product.galleryImages && product.galleryImages.length > 0 ? (
                  <div className="relative w-full max-w-sm">
                    {/* Stacked images effect */}
                    <div className="relative">
                      {product.galleryImages.slice(0, 3).map((img, i) => (
                        <div
                          key={i}
                          className={`${i === 0 ? 'relative' : 'absolute inset-0'} rounded-xl overflow-hidden shadow-lg`}
                          style={{
                            transform: `rotate(${(i - 1) * 3}deg) translateX(${i * 8}px)`,
                            zIndex: 3 - i,
                          }}
                        >
                          <div className="relative aspect-[3/4]">
                            <Image
                              src={img}
                              alt={`Inside preview ${i + 1}`}
                              fill
                              className="object-cover"
                              sizes="300px"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-neutral-500">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
                    <p>Preview images coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 4: Simple A+ Content Layout                           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-white">
          <div className="mx-auto max-w-[970px] px-4 md:px-8 lg:px-16 py-16 space-y-12">
            {/* Three 970x300 Banners */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative w-full aspect-[97/30] bg-neutral-100 overflow-hidden">
                  <Image
                    src={`https://picsum.photos/seed/noble-aplus-ban-${i * 10}/970/300`}
                    alt={`A+ Banner ${i}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 970px) 100vw, 970px"
                  />
                </div>
              ))}
            </div>

            {/* Three Horizontal Images with Text */}
            <div className="grid md:grid-cols-3 gap-8 pt-6">
              {[
                {
                  title: "Beautiful Designs",
                  desc: "Carefully crafted mosaic patterns that reveal stunning artwork as you color.",
                  imgSeed: "noble-sq-1"
                },
                {
                  title: "Relaxing Experience",
                  desc: "Unwind and de-stress with our mindful color-by-number approach.",
                  imgSeed: "noble-sq-2"
                },
                {
                  title: "Premium Quality",
                  desc: "Printed on high-quality paper with bold, easy-to-read numbers and lines.",
                  imgSeed: "noble-sq-3"
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col text-center group">
                  <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden mb-5">
                    <Image
                      src={`https://picsum.photos/seed/${item.imgSeed}/600/450`}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 6: "Part of the series" — Related Products Carousel   */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section className="bg-white border-t border-neutral-100">
            <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-neutral-900">
                  Part of the series
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollCarousel('left')}
                    className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollCarousel('right')}
                    className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div ref={carouselRef} className="series-carousel">
                {relatedProducts.map((relProduct) => (
                  <Link
                    key={relProduct._id}
                    href={`/product/${relProduct.slug}`}
                    className="series-item group"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 shadow-sm">
                      <Image
                        src={relProduct.coverImage}
                        alt={relProduct.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="140px"
                      />
                    </div>
                    <h3 className="mt-2 text-xs font-medium text-neutral-700 line-clamp-2 group-hover:text-neutral-900 transition-colors">
                      {relProduct.title}
                    </h3>
                    {relProduct.price && (
                      <span className="text-xs font-semibold text-neutral-900">{relProduct.price}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
