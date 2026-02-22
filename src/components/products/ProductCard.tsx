import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    theme: string;
    difficulty: string;
    coverImage: string;
    rating?: number;
    reviewCount?: number;
    price?: string | number;
  };
  priority?: boolean;
}

const themeColors: Record<string, string> = {
  'Animals': 'var(--mosaic-coral)',
  'Flowers': 'var(--mosaic-rose)',
  'Mandala': 'var(--mosaic-purple)',
  'Nature': 'var(--mosaic-teal)',
  'Geometric': 'var(--mosaic-sky)',
  'Abstract': 'var(--mosaic-gold)',
};

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const themeColor = themeColors[product.theme] || 'var(--mosaic-coral)';
  
  return (
    <div className="mosaic-card group relative bg-white overflow-hidden">
      {/* Color accent bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
      />
      
      <Link href={`/product/${product.slug}`} className="block aspect-[3/4] relative overflow-hidden bg-neutral-50">
        <Image
          src={product.coverImage}
          alt={product.title}
          fill
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            className="text-white text-xs border-0 rounded-lg"
            style={{ backgroundColor: themeColor }}
          >
            {product.theme}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge 
            variant="outline" 
            className="bg-white/90 text-neutral-700 text-xs capitalize rounded-lg border-0"
          >
            {product.difficulty}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-neutral-900 group-hover:text-[var(--mosaic-purple)] transition-colors line-clamp-2 mb-2">
            {product.title}
          </h3>
        </Link>
        
        {product.shortDescription && (
          <p className="text-sm text-neutral-500 line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 4.5)
                    ? 'text-[var(--mosaic-gold)] fill-[var(--mosaic-gold)]'
                    : 'text-neutral-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-neutral-500">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          {product.price ? (
            <span className="font-bold text-lg text-neutral-900">{product.price}</span>
          ) : (
            <span className="text-sm text-neutral-500">Available on Amazon</span>
          )}
          <Button 
            asChild 
            size="sm" 
            className="bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white rounded-lg"
          >
            <Link href={`/product/${product.slug}`}>
              View
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
