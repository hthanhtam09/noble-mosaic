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
    <div className="group relative bg-white overflow-hidden shadow-xl">
      <Link href={product.slug.startsWith('/') ? product.slug : `/books/${product.slug}`} className="block aspect-[3/4] relative overflow-hidden bg-neutral-50/50 p-6 sm:p-8">
        <div className="relative w-full h-full">
          <Image
            src={product.coverImage}
            alt={product.title}
            fill
            priority={priority}
            className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      <button
        onClick={handleWishlistClick}
        className={cn(
          "absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer",
          inWishlist
            ? "bg-rose-50 text-rose-500 shadow-rose-200/50"
            : "bg-white/80 text-neutral-400 hover:text-rose-500 hover:bg-white shadow-black/5",
          "shadow-lg hover:scale-110 active:scale-95"
        )}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
      </button>

      {/* Content */}
      <div className="p-4 text-center">
        <Link href={product.slug.startsWith('/') ? product.slug : `/books/${product.slug}`}>
          <h3 className="font-semibold text-neutral-900 group-hover:text-[var(--mosaic-purple)] transition-colors line-clamp-2 mb-1">
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
