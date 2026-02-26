'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useProducts } from '@/hooks/api/useProducts';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, LayoutGrid, X, Palette, Filter, Loader2 } from 'lucide-react';
import { CollectionPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

function BookContent() {
  const { data: products = [], isLoading } = useProducts();

  const [sortBy, setSortBy] = useState('newest');
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');
  const [displayLimit, setDisplayLimit] = useState(12);

  useEffect(() => {
    setDisplayLimit(12);
  }, [sortBy, gridView]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, sortBy]);

  const clearFilters = () => {
    setSortBy('newest');
  };

  const hasActiveFilters = sortBy !== 'newest';

  const displayedProducts = filteredProducts.slice(0, displayLimit);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Structured Data */}
      <CollectionPageJsonLd
        name="All Mosaic Color By Number Books"
        description="Browse our complete collection of premium mosaic color by number books for adults."
        url="https://noblemosaic.com/books"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Books', url: 'https://noblemosaic.com/books' },
        ]}
      />

      <Header />

      <main className="flex-grow">
        <div className="layout-inner py-8">
          {/* SEO-friendly heading */}
          <h1 className="sr-only">Mosaic Color By Number Books</h1>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 p-4 bg-white rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="h-5 w-5 text-neutral-400" />

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] rounded-xl border-neutral-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-neutral-500 hover:text-neutral-700 rounded-xl"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Grid Toggle */}
              <div className="hidden sm:flex items-center border rounded-xl bg-white overflow-hidden">
                <Button
                  variant={gridView === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setGridView('grid')}
                  className="rounded-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridView === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setGridView('list')}
                  className="rounded-none"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-neutral-500 mb-6">
            Showing <span className="font-medium text-neutral-900">{displayedProducts.length}</span> of <span className="font-medium text-neutral-900">{filteredProducts.length}</span> book{filteredProducts.length !== 1 ? 's' : ''}
          </p>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className={`
                grid gap-6
                ${gridView === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1 md:grid-cols-2'
                }
              `}>
                {displayedProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} priority={index < 4} />
                ))}
              </div>

              {filteredProducts.length > displayLimit && (
                <div className="mt-12 flex justify-center">
                  <Button
                    onClick={() => setDisplayLimit(prev => prev + 12)}
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 bg-white hover:bg-neutral-50"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] opacity-20 flex items-center justify-center">
                <Palette className="h-10 w-10 text-white" />
              </div>
              <p className="text-neutral-500 mb-4">
                {products.length === 0 ? 'No books available yet. Check back soon!' : 'No books found matching your filters.'}
              </p>
              {products.length > 0 && (
                <Button variant="outline" onClick={clearFilters} className="rounded-xl">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookPageClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--mosaic-purple)] border-t-transparent" />
      </div>
    }>
      <BookContent />
    </Suspense>
  );
}
