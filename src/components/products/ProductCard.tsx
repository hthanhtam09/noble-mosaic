import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/store/use-wishlist';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';


interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    coverImage: string;
    showRating?: boolean;
    rating?: number;
    reviewCount?: number;
    price?: string | number;
    isComingSoon?: boolean;
  };
  priority?: boolean;
}



export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const inWishlist = mounted ? isInWishlist(product._id) : false;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
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
  };

  return (
    <div className="p-2 flex flex-col items-center">
      <div className="relative w-full max-w-50 sm:max-w-60">
        <Link prefetch={true} href={product.slug.startsWith('/') ? product.slug : `/books/${product.slug}`} className="group block aspect-3/4 relative overflow-hidden rounded-2xl">
          <div className="relative w-full h-full">
            <Image
              src={product.coverImage}
              alt={product.title}
              fill
              priority={priority}
              quality={65}
              fetchPriority={priority ? "high" : "auto"}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 200px, (max-width: 1024px) 250px, 300px"
            />
          </div>
          <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          {product.isComingSoon && (
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 bg-(--mosaic-gold) backdrop-blur-sm text-white text-xs sm:text-sm font-bold uppercase tracking-widest py-3 px-4 shadow-xl z-20 flex items-center justify-center transform -rotate-3 border-y border-(--mosaic-gold)/20">
              Coming Soon
            </div>
          )}
        </Link>

        <button
          onClick={handleWishlistClick}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer",
            inWishlist
              ? "bg-orange-50 text-orange-500 shadow-orange-200/50"
              : "bg-white/80 text-neutral-400 hover:text-orange-500 hover:bg-white shadow-black/5",
            "shadow-md hover:scale-110 active:scale-95"
          )}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 text-center w-full max-w-50 sm:max-w-60">
        <Link prefetch={true} href={product.slug.startsWith('/') ? product.slug : `/books/${product.slug}`} className="group">
          <h3 className="font-semibold text-neutral-900 group-hover:text-(--mosaic-purple) transition-colors line-clamp-2 mb-1">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-1">
          {product.price ? (
            <span className="font-bold text-lg text-neutral-900">{product.price}</span>
          ) : (
            <span className="text-sm font-medium text-neutral-500">Available on Amazon</span>
          )}
        </div>
      </div>
    </div>
  );
}
