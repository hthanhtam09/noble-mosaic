import Link from 'next/link';
import Image from 'next/image';

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
  return (
    <div className="group relative bg-white overflow-hidden shadow-xl">
      <Link href={`/product/${product.slug}`} className="block aspect-[3/4] relative overflow-hidden bg-neutral-50/50 p-6 sm:p-8">
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

      {/* Content */}
      <div className="p-4 text-center">
        <Link href={`/product/${product.slug}`}>
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
