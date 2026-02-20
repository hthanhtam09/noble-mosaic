'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, LayoutGrid, X, Palette, Filter } from 'lucide-react';

const themes = ['All', 'Animals', 'Flowers', 'Mandala', 'Nature', 'Geometric', 'Abstract'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

// Sample products data
const sampleProducts = [
  {
    _id: '1',
    title: 'Mosaic Animals Color By Number',
    slug: 'mosaic-animals-color-by-number',
    shortDescription: 'Discover the beauty of wildlife through intricate mosaic designs.',
    theme: 'Animals',
    difficulty: 'beginner' as const,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 127,
    price: '$12.99',
  },
  {
    _id: '2',
    title: 'Floral Mosaic Masterpieces',
    slug: 'floral-mosaic-masterpieces',
    shortDescription: 'A stunning collection of flower mosaic patterns to color.',
    theme: 'Flowers',
    difficulty: 'intermediate' as const,
    coverImage: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?w=400&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 89,
    price: '$14.99',
  },
  {
    _id: '3',
    title: 'Mandala Mosaic Journey',
    slug: 'mandala-mosaic-journey',
    shortDescription: 'Find inner peace with mesmerizing mandala mosaic designs.',
    theme: 'Mandala',
    difficulty: 'advanced' as const,
    coverImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 156,
    price: '$15.99',
  },
  {
    _id: '4',
    title: 'Nature Patterns Mosaic',
    slug: 'nature-patterns-mosaic',
    shortDescription: 'Explore the natural world through beautiful mosaic art.',
    theme: 'Nature',
    difficulty: 'beginner' as const,
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
    rating: 4.6,
    reviewCount: 78,
    price: '$11.99',
  },
  {
    _id: '5',
    title: 'Geometric Mosaic Wonders',
    slug: 'geometric-mosaic-wonders',
    shortDescription: 'Challenge yourself with intricate geometric patterns.',
    theme: 'Geometric',
    difficulty: 'advanced' as const,
    coverImage: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 92,
    price: '$16.99',
  },
  {
    _id: '6',
    title: 'Abstract Mosaic Dreams',
    slug: 'abstract-mosaic-dreams',
    shortDescription: 'Let your imagination run wild with abstract designs.',
    theme: 'Abstract',
    difficulty: 'intermediate' as const,
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=600&fit=crop',
    rating: 4.5,
    reviewCount: 64,
    price: '$13.99',
  },
  {
    _id: '7',
    title: 'Wildlife Mosaic Adventure',
    slug: 'wildlife-mosaic-adventure',
    shortDescription: 'Color your way through the animal kingdom.',
    theme: 'Animals',
    difficulty: 'intermediate' as const,
    coverImage: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 103,
    price: '$14.99',
  },
  {
    _id: '8',
    title: 'Garden Flowers Mosaic',
    slug: 'garden-flowers-mosaic',
    shortDescription: 'Beautiful garden flowers in stunning mosaic patterns.',
    theme: 'Flowers',
    difficulty: 'beginner' as const,
    coverImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 145,
    price: '$12.99',
  },
];

function ShopContent() {
  const searchParams = useSearchParams();
  
  const themeParam = searchParams.get('theme');
  const difficultyParam = searchParams.get('difficulty');
  
  const initialTheme = themeParam && themes.includes(themeParam) ? themeParam : 'All';
  const initialDifficulty = difficultyParam && difficulties.includes(difficultyParam) ? difficultyParam : 'All';
  
  const [products] = useState(sampleProducts);
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
  const [sortBy, setSortBy] = useState('newest');
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');

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
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header */}
        <div className="mosaic-hero border-b border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="h-6 w-6 text-[var(--mosaic-purple)]" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900">
                Shop All Books
              </h1>
            </div>
            <p className="text-neutral-600 max-w-2xl">
              Browse our complete collection of mosaic color by number books. Each book features unique designs for relaxation and creative joy.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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
            Showing <span className="font-medium text-neutral-900">{filteredProducts.length}</span> book{filteredProducts.length !== 1 ? 's' : ''}
          </p>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className={`
              grid gap-6
              ${gridView === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 md:grid-cols-2'
              }
            `}>
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] opacity-20 flex items-center justify-center">
                <Palette className="h-10 w-10 text-white" />
              </div>
              <p className="text-neutral-500 mb-4">No books found matching your filters.</p>
              <Button variant="outline" onClick={clearFilters} className="rounded-xl">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function ShopPage() {
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
