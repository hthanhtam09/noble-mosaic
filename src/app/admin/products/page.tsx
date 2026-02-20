'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Pencil, Trash2, Search, MoreVertical, 
  Star, ExternalLink, Eye, Copy, Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  theme: string;
  difficulty: string;
  coverImage: string;
  galleryImages: string[];
  amazonLink: string;
  bulletPoints: string[];
  rating: number;
  reviewCount: number;
  price: string;
  featured: boolean;
  createdAt: string;
}

// Sample products data - in production, this would come from an API
const initialProducts: Product[] = [
  {
    _id: '1',
    title: 'Mosaic Animals Color By Number',
    slug: 'mosaic-animals-color-by-number',
    description: 'Discover the beauty of wildlife through intricate mosaic designs. Perfect for relaxation and creative expression.',
    theme: 'Animals',
    difficulty: 'beginner',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=300&fit=crop',
    galleryImages: [],
    amazonLink: 'https://amazon.com/dp/example1',
    bulletPoints: ['50+ designs', 'Premium paper', 'Large 8.5x11 format'],
    rating: 4.8,
    reviewCount: 127,
    price: '$12.99',
    featured: true,
    createdAt: '2024-01-15',
  },
  {
    _id: '2',
    title: 'Floral Mosaic Masterpieces',
    slug: 'floral-mosaic-masterpieces',
    description: 'A stunning collection of flower mosaic patterns to color.',
    theme: 'Flowers',
    difficulty: 'intermediate',
    coverImage: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?w=200&h=300&fit=crop',
    galleryImages: [],
    amazonLink: 'https://amazon.com/dp/example2',
    bulletPoints: ['40+ designs', 'Premium paper', 'Color guide included'],
    rating: 4.9,
    reviewCount: 89,
    price: '$14.99',
    featured: true,
    createdAt: '2024-01-10',
  },
  {
    _id: '3',
    title: 'Mandala Mosaic Journey',
    slug: 'mandala-mosaic-journey',
    description: 'Find inner peace with mesmerizing mandala mosaic designs.',
    theme: 'Mandala',
    difficulty: 'advanced',
    coverImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200&h=300&fit=crop',
    galleryImages: [],
    amazonLink: 'https://amazon.com/dp/example3',
    bulletPoints: ['60+ designs', 'Premium paper', 'Intricate patterns'],
    rating: 4.7,
    reviewCount: 156,
    price: '$15.99',
    featured: false,
    createdAt: '2024-01-05',
  },
  {
    _id: '4',
    title: 'Nature Patterns Mosaic',
    slug: 'nature-patterns-mosaic',
    description: 'Explore the natural world through beautiful mosaic art.',
    theme: 'Nature',
    difficulty: 'beginner',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=300&fit=crop',
    galleryImages: [],
    amazonLink: 'https://amazon.com/dp/example4',
    bulletPoints: ['35+ designs', 'Premium paper', 'Beginner friendly'],
    rating: 4.6,
    reviewCount: 78,
    price: '$11.99',
    featured: false,
    createdAt: '2024-01-01',
  },
];

const themes = ['All', 'Animals', 'Flowers', 'Mandala', 'Nature', 'Geometric', 'Abstract'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/products/${slug}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setProducts(products.filter(p => p.slug !== slug));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleDuplicate = (product: Product) => {
    const newProduct: Product = {
      ...product,
      _id: Date.now().toString(),
      slug: `${product.slug}-copy`,
      title: `${product.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    setProducts([newProduct, ...products]);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.theme.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTheme = themeFilter === 'All' || product.theme === themeFilter;
      const matchesDifficulty = difficultyFilter === 'All' || product.difficulty === difficultyFilter;
      return matchesSearch && matchesTheme && matchesDifficulty;
    });
  }, [products, searchQuery, themeFilter, difficultyFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your coloring book catalog</p>
        </div>
        <Button asChild className="bg-neutral-900 hover:bg-neutral-800 text-white">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>
        <Select value={themeFilter} onValueChange={setThemeFilter}>
          <SelectTrigger className="w-[140px] bg-white">
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
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[140px] bg-white">
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
      </div>

      {/* Results Count */}
      <p className="text-sm text-neutral-500">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-neutral-300" />
            </div>
            <p className="text-neutral-500 mb-4">No products found matching your filters.</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setThemeFilter('All');
              setDifficultyFilter('All');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <Image
                      src={product.coverImage}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {product.featured && (
                      <div className="absolute top-1 left-1">
                        <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-neutral-900 line-clamp-1">{product.title}</h3>
                        <p className="text-sm text-neutral-500 line-clamp-1 mt-0.5">{product.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-neutral-900">{product.price}</p>
                        <p className="text-xs text-neutral-500">{product.reviewCount} reviews</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">{product.theme}</Badge>
                      <Badge variant="outline" className="text-xs capitalize">{product.difficulty}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium text-neutral-700">{product.rating}</span>
                      </div>
                    </div>

                    {/* Bullet Points Preview */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.bulletPoints.slice(0, 3).map((point, idx) => (
                        <span key={idx} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button asChild variant="ghost" size="sm" title="View on site">
                      <a href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="ghost" size="sm" title="Amazon link">
                      <a href={product.amazonLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.slug}`} className="flex items-center">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(product.slug)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
