'use client';

import { useState, useRef, useEffect } from 'react';
import { useProduct } from '@/hooks/api/useProducts';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { useWishlist } from '@/store/use-wishlist';
import { cn } from '@/lib/utils';
import {
  Star,
  ExternalLink,
  Loader2,
  Grid3X3,
  Maximize,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Book,
  Ruler,
  Heart,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ProductJsonLd,
  BreadcrumbJsonLd,
} from '@/components/seo/JsonLd';

export default function ProductDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, isError: notFound } = useProduct(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedEdition, setSelectedEdition] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { addItem, removeItem, isInWishlist } = useWishlist();

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const product = data?.product || null;
  const relatedProducts = data?.relatedProducts || [];

  const AMAZON_MARKETPLACES = [
    { code: 'US', domain: 'amazon.com', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', domain: 'amazon.co.uk', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', domain: 'amazon.ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', domain: 'amazon.com.au', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', domain: 'amazon.de', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', domain: 'amazon.fr', name: 'France', flag: '🇫🇷' },
    { code: 'ES', domain: 'amazon.es', name: 'Spain', flag: '🇪🇸' },
    { code: 'IT', domain: 'amazon.it', name: 'Italy', flag: '🇮🇹' },
    { code: 'NL', domain: 'amazon.nl', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'PL', domain: 'amazon.pl', name: 'Poland', flag: '🇵🇱' },
    { code: 'SE', domain: 'amazon.se', name: 'Sweden', flag: '🇸🇪' },
    { code: 'BE', domain: 'amazon.com.be', name: 'Belgium', flag: '🇧🇪' },
    { code: 'IE', domain: 'amazon.co.uk', name: 'Ireland', flag: '🇮🇪' },
    { code: 'JP', domain: 'amazon.co.jp', name: 'Japan', flag: '🇯🇵' },
  ];

  const getProductUrl = (regionCode: string) => {
    let asin = selectedEdition !== null && product?.editions?.[selectedEdition]?.asin
      ? product.editions[selectedEdition].asin
      : product?.asin;

    const fallbackLink = selectedEdition !== null && product?.editions?.[selectedEdition]?.link
      ? product.editions[selectedEdition].link
      : product?.amazonLink;

    if (!asin && fallbackLink) {
      const match = fallbackLink.match(/\/(?:dp|product)\/([A-Z0-9]{10})/i);
      if (match) asin = match[1];
    }

    if (asin) {
      const marketplace = AMAZON_MARKETPLACES.find(m => m.code === regionCode);
      if (marketplace) {
        return `https://www.${marketplace.domain}/dp/${asin}`;
      }
    }

    return fallbackLink || '#';
  };

  const handleRegionChange = (region: string) => {
    const urlToOpen = getProductUrl(region);
    if (urlToOpen && urlToOpen !== '#') {
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Feature icons data
  const featureIcons = [
    { icon: Book, label: 'Print length', sublabel: product?.printLength || '107 pages' },
    { icon: Ruler, label: 'Dimensions', sublabel: product?.dimensions || '8.5 x 0.26 x 11 inches' },
    { icon: Grid3X3, label: 'Cell Size', sublabel: '5×5mm' },
    { icon: Maximize, label: 'Bold Lines', sublabel: 'Easy to see' },
  ];

  // Determine cover image
  const currentCoverImage = product?.coverImage;

  // All images (cover + gallery)
  const allImages = product
    ? [currentCoverImage, ...(product.galleryImages || [])].filter(Boolean) as string[]
    : [];

  const specificDescription = selectedEdition !== null && product?.editions?.[selectedEdition]?.description
    ? product.editions[selectedEdition].description
    : product?.description;

  const fullDescription = `${specificDescription || ''}\n\n${product?.generalDescription || ''}`.trim();

  // Check if description needs Read More button
  useEffect(() => {
    // Small timeout to allow content to render and fonts to load
    const timer = setTimeout(() => {
      if (descriptionRef.current) {
        if (descriptionRef.current.scrollHeight > 450) {
          setShowReadMore(true);
        } else {
          setShowReadMore(false);
          setIsDescriptionExpanded(false);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [fullDescription, selectedEdition]);

  // Extract A+ Content
  const rawAPlusContent = product?.aPlusContent;

  const currentAPlusContent: string[] = [];
  if (rawAPlusContent && Array.isArray(rawAPlusContent)) {
    rawAPlusContent.forEach((item: any) => {
      if (typeof item === 'string') {
        currentAPlusContent.push(item);
      } else {
        if (item.image) currentAPlusContent.push(item.image);
        if (item.images && Array.isArray(item.images)) {
          currentAPlusContent.push(...item.images);
        }
      }
    });
  }

  // Auto-advance gallery images
  useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % allImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allImages.length]);

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="grow flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-4">Product Not Found</h1>
        <p className="text-neutral-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild variant="outline">
          <Link href="/books">Back to Books</Link>
        </Button>
      </div>
    );
  }



  return (
    <>
      {/* Structured Data */}
      <ProductJsonLd
        name={product.title}
        description={fullDescription || ''}
        image={product.coverImage}
        url={`https://noblemosaic.com/books/${product.slug}`}
        price={product.price == null ? undefined : String(product.price)}
        rating={product.showRating === false ? undefined : product.rating}
        reviewCount={product.showRating === false ? undefined : product.reviewCount}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Books', url: 'https://noblemosaic.com/books' },
          {
            name: product.title,
            url: `https://noblemosaic.com/books/${product.slug}`,
          },
        ]}
      />

      <div className="grow">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-neutral-100">
          <div className="layout-inner py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-neutral-500">
              <Link href="/" className="hover:text-neutral-700 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/books" className="hover:text-neutral-700 transition-colors">Books</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 1: Hero — Product Images + Info                       */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-white">
          <div className="layout-inner py-8 lg:py-12">
            <div className="grid lg:grid-cols-[1.2fr_1.4fr_1fr] gap-8 lg:gap-14 items-start">
              {/* Left: Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-3/4 bg-neutral-50 overflow-hidden rounded-sm">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={allImages[selectedImage] || product.coverImage}
                        alt={`${product.title} - Mosaic Color By Number Book`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Thumbnail Strip */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-16 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === index
                          ? 'border-black shadow-md'
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
                {product.isComingSoon && (
                  <div className="mb-3">
                    <span className="inline-flex items-center bg-(--mosaic-gold) text-white text-xs font-bold uppercase tracking-widest py-1.5 px-3 rounded-full shadow-sm">
                      Coming Soon
                    </span>
                  </div>
                )}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-neutral-900 leading-tight">
                  {product.title}
                </h1>
                <hr className="my-4" />

                {/* Rating */}
                {product.showRating !== false && (product.rating ?? 0) > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-neutral-900">
                      {product.rating}
                    </span>
                    <div className="flex items-center">
                      {[...new Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(product.rating ?? 0)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-200'
                            }`}
                        />
                      ))}
                    </div>
                    {(product.reviewCount ?? 0) > 0 && (
                      <span className="text-sm text-neutral-500">
                        ({product.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="relative">
                  <motion.div
                    initial={false}
                    animate={{ height: isDescriptionExpanded || !showReadMore ? 'auto' : 450 }}
                    className="overflow-hidden"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div
                      ref={descriptionRef}
                      className="text-neutral-900 leading-relaxed text-sm md:text-base prose prose-sm max-w-none prose-p:my-3 prose-headings:my-4 prose-headings:font-bold prose-h3:text-lg prose-ul:my-2 prose-ul:list-disc prose-strong:font-bold prose-strong:text-neutral-900 pb-2"
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {fullDescription}
                      </ReactMarkdown>
                    </div>
                  </motion.div>

                  {showReadMore && (
                    <div className="mt-4 flex justify-start">
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="text-sm font-semibold text-(--mosaic-teal) hover:text-neutral-900 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {isDescriptionExpanded ? (
                          <>Show less <ChevronUp className="h-4 w-4" /></>
                        ) : (
                          <>Read more <ChevronDown className="h-4 w-4" /></>
                        )}
                      </button>
                    </div>
                  )}
                </div>





                {/* Spacer to push content down if needed */}
                <div className="grow min-h-4" />
              </div>

              {/* Right: Purchase Options Column */}
              <div className="lg:pl-6 flex flex-col pt-4 lg:pt-0 sticky top-24">
                <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm flex flex-col">
                  {/* Product Editions */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
                      Choose Edition
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {/* Original / Standard Edition */}
                      <button
                        onClick={() => setSelectedEdition(null)}
                        className={`relative px-5 py-3 rounded-xl border-2 text-sm font-bold transition-all overflow-hidden ${selectedEdition === null
                          ? 'border-black bg-black text-white shadow-md transform scale-[1.02]'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                          }`}
                      >
                        Standard Edition
                      </button>

                      {/* Premium Edition */}
                      {product.editions?.[0] && (
                        <button
                          onClick={() => setSelectedEdition(0)}
                          className={`relative px-5 py-3 rounded-xl border-2 text-sm font-bold transition-all overflow-hidden ${selectedEdition === 0
                            ? 'border-black bg-black text-white shadow-md transform scale-[1.02]'
                            : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                            }`}
                        >
                          {product.editions[0].name}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
                      Price
                    </h3>
                    <span className="text-3xl font-bold text-neutral-900 block">
                      {selectedEdition !== null && product.editions?.[selectedEdition]?.price
                        ? product.editions[selectedEdition].price
                        : product.price}
                    </span>
                  </div>

                  <hr className="my-6" />

                  {/* CTA Section */}
                  <div className="space-y-3">
                    {product.isComingSoon ? (
                      null
                    ) : (
                      <div className="space-y-2">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 text-base font-semibold rounded-xl h-12 shadow-sm border-0 focus:ring-amber-500 focus:border-amber-500 transition-colors flex items-center justify-center gap-2 relative">
                              <span className="flex-1 flex items-center justify-center gap-2">
                                Buy on Amazon <ExternalLink className="h-4 w-4 text-neutral-800" />
                              </span>
                              <ChevronDown className="h-4 w-4 absolute right-4 text-neutral-800" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center" className="max-h-75 w-64 md:w-[--radix-dropdown-menu-trigger-width]">
                            {AMAZON_MARKETPLACES.map((market) => (
                              <DropdownMenuItem
                                key={market.code}
                                onClick={() => handleRegionChange(market.code)}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center justify-between gap-2 w-full pr-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-base leading-none">{market.flag}</span>
                                    <span className="font-medium">{market.name}</span>
                                  </div>
                                  <span className="text-neutral-400 text-xs">({market.domain})</span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <p className="text-center text-[10px] text-neutral-400 mt-1">Select your Amazon marketplace</p>
                      </div>
                    )}
                    <Button
                      onClick={() => {
                        if (!mounted) return;
                        if (isInWishlist(product._id)) {
                          removeItem(product._id);
                        } else {
                          addItem({
                            _id: product._id,
                            title: product.title,
                            slug: product.slug,
                            coverImage: product.coverImage,
                            price: product.price,
                          });
                        }
                      }}
                      variant="outline"
                      size="lg"
                      className={cn(
                        "w-full rounded-full h-12 border-2 text-base font-semibold transition-all",
                        mounted && isInWishlist(product._id)
                          ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                      )}
                    >
                      <Heart className={cn("h-5 w-5 mr-2", mounted && isInWishlist(product._id) && "fill-current")} />
                      {mounted && isInWishlist(product._id) ? "In Wishlist" : "Add to Wishlist"}
                    </Button>
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
          <div className="layout-inner py-8">
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
        {/* SECTION 4: Simple A+ Content Layout                           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-white">
          <div className="mx-auto max-w-242.5 py-16 space-y-12">
            {currentAPlusContent.length > 0 && (
              <div className="space-y-6">
                {currentAPlusContent.map((imgSrc, i) => (
                  <div key={i} className="relative w-full aspect-97/60 bg-neutral-100 overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={`${product.title} - Preview Detail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 970px) 100vw, 970px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>


        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 6: "Products related to this item" — Related Products Carousel   */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section className="bg-white border-t border-neutral-100">
            <div className="layout-inner py-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-neutral-900">
                  Products related to this item
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
                    href={`/books/${relProduct.slug}`}
                    className="series-item group"
                  >
                    <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-neutral-100 shadow-sm">
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
      </div>
    </>
  );
}
