'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/store/use-wishlist';
import { Heart, HeartCrack, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPageClient() {
  const { items, clearWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--mosaic-purple)] border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow layout-inner py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
            My Wishlist
          </h1>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="rounded-xl text-neutral-500 hover:text-rose-600 hover:bg-rose-50 border-neutral-200"
            >
              <HeartCrack className="h-4 w-4 mr-2" />
              Clear Wishlist
            </Button>
          )}
        </div>
        
        <hr className="border-neutral-200 mb-8" />

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-rose-50 flex items-center justify-center">
              <Heart className="h-12 w-12 text-rose-300" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your wishlist is empty</h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              Save your favorite mosaic color by number books here to view and purchase them later.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/books">
                <Button className="rounded-xl text-white w-full sm:w-auto px-8 py-6 h-auto text-lg">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, index) => (
              <ProductCard
                key={item._id}
                product={item as any}
                priority={index < 4}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
