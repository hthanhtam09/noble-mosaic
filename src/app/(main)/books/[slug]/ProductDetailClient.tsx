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
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const MarkdownRenderer = dynamic(() => import('@/components/ui/MarkdownRenderer'), { ssr: true });
import {
  ProductJsonLd,
  BreadcrumbJsonLd,
} from '@/components/seo/JsonLd';

const AMAZON_MARKETPLACES = [
  { code: 'US', domain: 'amazon.com', name: 'United States', countryCode: 'us' },
  { code: 'UK', domain: 'amazon.co.uk', name: 'United Kingdom', countryCode: 'gb' },
  { code: 'CA', domain: 'amazon.ca', name: 'Canada', countryCode: 'ca' },
  { code: 'AU', domain: 'amazon.com.au', name: 'Australia', countryCode: 'au' },
  { code: 'DE', domain: 'amazon.de', name: 'Germany', countryCode: 'de' },
  { code: 'FR', domain: 'amazon.fr', name: 'France', countryCode: 'fr' },
  { code: 'ES', domain: 'amazon.es', name: 'Spain', countryCode: 'es' },
  { code: 'IT', domain: 'amazon.it', name: 'Italy', countryCode: 'it' },
  { code: 'NL', domain: 'amazon.nl', name: 'Netherlands', countryCode: 'nl' },
  { code: 'PL', domain: 'amazon.pl', name: 'Poland', countryCode: 'pl' },
  { code: 'SE', domain: 'amazon.se', name: 'Sweden', countryCode: 'se' },
  { code: 'BE', domain: 'amazon.com.be', name: 'Belgium', countryCode: 'be' },
  { code: 'IE', domain: 'amazon.co.uk', name: 'Ireland', countryCode: 'ie' },
  { code: 'JP', domain: 'amazon.co.jp', name: 'Japan', countryCode: 'jp' },
];

export default function ProductDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, isError: notFound } = useProduct(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedEdition, setSelectedEdition] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>('US');
  const [isHoveringGallery, setIsHoveringGallery] = useState(false);

  const { addItem, removeItem, isInWishlist } = useWishlist();

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    try {
      const savedRegion = localStorage.getItem('mosaic_amazon_region');
      if (savedRegion && AMAZON_MARKETPLACES.some(m => m.code === savedRegion)) {
        setSelectedRegionCode(savedRegion);
      }
    } catch (e) { }
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const product = data?.product || null;
  const relatedProducts = data?.relatedProducts || [];

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
    try {
      localStorage.setItem('mosaic_amazon_region', region);
    } catch (e) { }
    setSelectedRegionCode(region);

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

  let fullDescription = specificDescription || '';
  if (product?.generalDescription && !fullDescription.includes(product.generalDescription)) {
    fullDescription = `${fullDescription}\n\n${product.generalDescription}`.trim();
  } else {
    fullDescription = fullDescription.trim();
  }

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

  const currentAPlusContent: { url: string; size: '970x600' | '970x300' }[] = [];
  if (rawAPlusContent && Array.isArray(rawAPlusContent)) {
    rawAPlusContent.forEach((item: any) => {
      if (typeof item === 'string') {
        currentAPlusContent.push({ url: item, size: '970x600' });
      } else if (item && typeof item === 'object') {
        if (item.url) {
          currentAPlusContent.push({
            url: item.url,
            size: item.size || '970x600',
          });
        } else if (item.image) {
          currentAPlusContent.push({
            url: item.image,
            size: item.size || '970x600',
          });
        } else if (item.images && Array.isArray(item.images)) {
          item.images.forEach((img: string) => {
            currentAPlusContent.push({ url: img, size: '970x600' });
          });
        }
      }
    });
  }

  // Auto-advance gallery images
  useEffect(() => {
    if (allImages.length <= 1 || isHoveringGallery) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % allImages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [allImages.length, isHoveringGallery]);

  // Set default edition if standard ASIN is missing
  useEffect(() => {
    if (product && !product.asin && selectedEdition === null) {
      if (product.editions && product.editions.length > 0) {
        const firstWithAsin = product.editions.findIndex(e => !!e.asin);
        if (firstWithAsin !== -1) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSelectedEdition(firstWithAsin);
        }
      }
    }
  }, [product]);

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

      <div className="grow pb-[140px] lg:pb-0">
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
              <div
                className="space-y-4 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto lg:max-w-none lg:mx-0 min-w-0"
                onMouseEnter={() => setIsHoveringGallery(true)}
                onMouseLeave={() => setIsHoveringGallery(false)}
              >
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
                        sizes="(max-width: 768px) 360px, 500px"
                        priority
                        quality={70}
                        fetchPriority="high"
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
                        onMouseEnter={() => setSelectedImage(index)}
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
              <div className="lg:pl-2 flex flex-col min-w-0">
                {/* Title */}
                {product.isComingSoon && (
                  <div className="mb-3">
                    <span className="inline-flex items-center bg-(--mosaic-gold) text-white text-xs font-bold uppercase tracking-widest py-1.5 px-3 rounded-full shadow-sm">
                      Coming Soon
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-neutral-900 leading-tight flex-wrap break-words">
                    {product.title}
                  </h1>

                  {/* Mobile Price & Wishlist Row */}
                  <div className="flex items-center justify-between lg:hidden mb-1">
                    <span className="text-3xl font-black text-black block leading-none">
                      {selectedEdition !== null && product.editions?.[selectedEdition]?.price
                        ? product.editions[selectedEdition].price
                        : product.price}
                    </span>
                    <button
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
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all bg-neutral-100",
                        mounted && isInWishlist(product._id) ? "text-orange-600 bg-orange-50" : "text-neutral-500"
                      )}
                    >
                      <Heart className={cn("h-5 w-5", mounted && isInWishlist(product._id) && "fill-current")} />
                    </button>
                  </div>
                </div>
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
                            ? 'text-orange-500 fill-orange-500'
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
                  <div
                    className={cn(
                      "overflow-hidden transition-[max-height] duration-500 ease-in-out relative",
                      (isDescriptionExpanded || !showReadMore) ? "max-h-[5000px]" : "max-h-[450px]"
                    )}
                  >
                    <div
                      ref={descriptionRef}
                      className="text-neutral-900 leading-relaxed text-sm md:text-base prose prose-sm max-w-none prose-p:my-3 prose-headings:my-4 prose-headings:font-bold prose-h3:text-lg prose-ul:my-2 prose-ul:list-disc prose-strong:font-bold prose-strong:text-neutral-900 pb-2 break-words"
                    >
                      <MarkdownRenderer content={fullDescription} />
                    </div>
                    {showReadMore && !isDescriptionExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                  </div>

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
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 p-4 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] lg:relative lg:z-auto lg:p-0 lg:bg-transparent lg:border-none lg:shadow-none lg:block lg:pl-6 lg:pt-0 lg:sticky lg:top-24">
                <div className="max-w-screen-xl mx-auto lg:p-6 lg:rounded-2xl lg:border lg:border-neutral-200 lg:bg-white lg:shadow-sm flex flex-col">
                  {/* Product Editions */}
                  {(product.asin || (product.editions && product.editions.some(e => e.asin))) && (
                    <div className="mb-3 lg:mb-6">
                      <h3 className="hidden lg:block text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
                        Choose Edition
                      </h3>
                      <div className="flex flex-row lg:flex-wrap w-full gap-2 lg:gap-3">
                        {[
                          ...(product.asin ? [{ name: 'Standard', value: null }] : []),
                          ...(product.editions
                            ?.map((e, i) => ({ ...e, originalIndex: i }))
                            .filter(e => !!e.asin)
                            .map((e) => ({ name: e.name, value: e.originalIndex })) || [])
                        ].map((ed) => (
                          <button
                            key={ed.name}
                            onClick={() => setSelectedEdition(ed.value)}
                            className={`flex-1 shrink-0 relative px-2 py-2 lg:px-5 lg:py-3 rounded-xl border-2 text-sm font-bold transition-all overflow-hidden ${selectedEdition === ed.value
                              ? 'border-black bg-black text-white shadow-md transform lg:scale-[1.02]'
                              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                              }`}
                          >
                            {ed.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-stretch lg:gap-0">
                    {/* Price */}
                    <div className="hidden lg:block shrink-0">
                      <h3 className="hidden lg:block text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
                        Price
                      </h3>
                      <span className="text-3xl lg:text-3xl font-black text-orange-600 lg:text-neutral-900 block leading-none">
                        {selectedEdition !== null && product.editions?.[selectedEdition]?.price
                          ? product.editions[selectedEdition].price
                          : product.price}
                      </span>
                    </div>

                    <hr className="hidden lg:block my-6" />

                    <div className="flex-1 flex flex-col justify-end lg:space-y-3 lg:gap-0 mt-2 lg:mt-0 w-full">
                      {product.isComingSoon ? null : (
                        <div className="w-full lg:space-y-2 lg:max-w-none">
                          <div className="flex w-full overflow-hidden rounded-xl shadow-[0_4px_14px_rgba(234,88,12,0.3)] lg:shadow-sm h-14 lg:h-12 border lg:border-none border-(--mosaic-orange)">
                            <Button
                              className="flex-1 rounded-r-none bg-primary hover:bg-primary/90 text-white text-base sm:text-lg font-bold h-full border-0 focus:ring-primary/50 transition-colors flex items-center justify-center relative px-2 sm:px-10"
                              onClick={() => handleRegionChange(selectedRegionCode)}
                            >
                              <span className="truncate">Buy on Amazon</span>
                              <div className="absolute right-2 sm:right-4 flex items-center gap-1 sm:gap-2">
                                {mounted && (() => {
                                  const m = AMAZON_MARKETPLACES.find(m => m.code === selectedRegionCode) || AMAZON_MARKETPLACES[0];
                                  return (
                                    <img
                                      src={`https://flagcdn.com/w20/${m.countryCode}.png`}
                                      srcSet={`https://flagcdn.com/w40/${m.countryCode}.png 2x`}
                                      width="20"
                                      alt={m.name}
                                      className="rounded-[2px] object-cover shadow-[0_0_2px_rgba(0,0,0,0.3)]"
                                    />
                                  )
                                })()}
                                <ExternalLink className="hidden sm:block h-4 w-4 text-white/90" />
                              </div>
                            </Button>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button className="rounded-l-none bg-primary hover:bg-primary/90 border-l border-white/20 text-white h-full w-12 sm:w-14 px-0 focus:ring-primary/50 transition-colors flex items-center justify-center shrink-0">
                                  <ChevronDown className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="max-h-75 w-64">
                                {AMAZON_MARKETPLACES.map((market) => (
                                  <DropdownMenuItem
                                    key={market.code}
                                    onClick={() => handleRegionChange(market.code)}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center justify-between gap-2 w-full pr-2">
                                      <div className="flex items-center gap-2">
                                        <img
                                          src={`https://flagcdn.com/w20/${market.countryCode}.png`}
                                          srcSet={`https://flagcdn.com/w40/${market.countryCode}.png 2x`}
                                          width="20"
                                          alt={market.name}
                                          className="rounded-[2px] object-cover shadow-sm"
                                        />
                                        <span className={cn("font-medium", selectedRegionCode === market.code ? "text-orange-600 font-bold" : "")}>{market.name}</span>
                                      </div>
                                      <span className="text-neutral-400 text-xs">({market.domain})</span>
                                    </div>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="hidden lg:block text-center text-xs text-neutral-500 mt-2 font-medium">Select your Amazon marketplace</p>
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
                          "hidden lg:flex w-full rounded-full h-12 border-2 transition-all text-base font-semibold items-center justify-center",
                          mounted && isInWishlist(product._id)
                            ? "border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700"
                            : "border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                        )}
                      >
                        <Heart className={cn("h-5 w-5 lg:mr-2", mounted && isInWishlist(product._id) && "fill-current")} />
                        <span className="hidden lg:inline">{mounted && isInWishlist(product._id) ? "In Wishlist" : "Add to Wishlist"}</span>
                      </Button>
                    </div>
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
          <div className="mx-auto max-w-[970px] py-16 space-y-12 px-4 lg:px-0">
            {currentAPlusContent.length > 0 && (
              <div className="space-y-6">
                {currentAPlusContent.map((imgObj, i) => (
                  <div key={i} className="w-full bg-neutral-100 overflow-hidden rounded-sm">
                    <Image
                      src={imgObj.url}
                      alt={`${product.title} - Preview Detail ${i + 1}`}
                      width={970}
                      height={imgObj.size === '970x300' ? 300 : 600}
                      className="w-full h-auto block"
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
                    prefetch={true}
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
