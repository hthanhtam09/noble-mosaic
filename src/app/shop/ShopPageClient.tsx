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

const themes = ['All', 'Animals', 'Flowers', 'Mandala', 'Nature', 'Geometric', 'Abstract'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

function ShopContent() {
  const searchParams = useSearchParams();
  
  const themeParam = searchParams.get('theme');
  const difficultyParam = searchParams.get('difficulty');
  
  const initialTheme = themeParam && themes.includes(themeParam) ? themeParam : 'All';
  const initialDifficulty = difficultyParam && difficulties.includes(difficultyParam) ? difficultyParam : 'All';
  
  const { data: products = [], isLoading } = useProducts();

  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
  const [sortBy, setSortBy] = useState('newest');
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');
  const [displayLimit, setDisplayLimit] = useState(12);

  useEffect(() => {
    setDisplayLimit(12);
  }, [selectedTheme, selectedDifficulty, sortBy, gridView]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedTheme !== 'All') {
      filtered = filtered.filter(p => p.theme === selectedTheme);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    }

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
  }, [products, selectedTheme, selectedDifficulty, sortBy]);

  const clearFilters = () => {
    setSelectedTheme('All');
    setSelectedDifficulty('All');
    setSortBy('newest');
  };

  const hasActiveFilters = selectedTheme !== 'All' || selectedDifficulty !== 'All';

  const displayedProducts = filteredProducts.slice(0, displayLimit);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Structured Data */}
      <CollectionPageJsonLd
        name="Shop All Coloring Books"
        description="Browse our complete collection of premium mosaic color by number books for adults."
        url="https://noblemosaic.com/shop"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Shop', url: 'https://noblemosaic.com/shop' },
        ]}
      />

      <Header />
      
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-8">
          {/* SEO-friendly heading */}
          <h1 className="sr-only">Shop Mosaic Color By Number Books</h1>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 p-4 bg-white rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="h-5 w-5 text-neutral-400" />
              
              {/* Theme Filter */}
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-[140px] rounded-xl border-neutral-200">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme === 'All' ? 'All Themes' : theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-[140px] rounded-xl border-neutral-200">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff === 'All' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </SelectItem>
                  ))}
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

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedTheme !== 'All' && (
                <Badge 
                  className="rounded-lg px-3 py-1.5 text-sm"
                  style={{ backgroundColor: 'var(--mosaic-coral)', color: 'white' }}
                >
                  Theme: {selectedTheme}
                  <button 
                    onClick={() => setSelectedTheme('All')}
                    className="ml-2 hover:opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedDifficulty !== 'All' && (
                <Badge 
                  className="bg-[var(--mosaic-teal)] text-white rounded-lg px-3 py-1.5 text-sm"
                >
                  Level: {selectedDifficulty}
                  <button 
                    onClick={() => setSelectedDifficulty('All')}
                    className="ml-2 hover:opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

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

export default function ShopPageClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--mosaic-purple)] border-t-transparent" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
