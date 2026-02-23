"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useHomeProducts } from "@/hooks/api/useProducts";
import ProductCard from "@/components/products/ProductCard";

export default function NewRelease() {
  const { data, isLoading } = useHomeProducts();
  const featuredProducts = data?.featured ?? [];

  return (
    <section className="py-12 md:py-16">
      <div className="layout-inner">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-neutral-800 font-nunito">
            New Release
          </h2>
          <Link
            href="/shop"
            className="text-base font-medium text-neutral-600 hover:text-neutral-900 border-b border-neutral-600 pb-0.5 transition-colors"
            aria-label="View more New Release"
          >
            View more
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-12">
            No products yet. Check back soon!
          </p>
        )}
      </div>
    </section>
  );
}
