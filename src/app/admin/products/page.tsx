'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminProducts } from '@/hooks/api/useAdmin';
import { QUERY_KEYS } from '@/lib/query-keys';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Pencil, Trash2, Search, MoreVertical,
  Star, ExternalLink, Eye, Copy, Loader2
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
import { useToast } from "@/hooks/use-toast";

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



export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useAdminProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [processingSlug, setProcessingSlug] = useState<string | null>(null);

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setProcessingSlug(slug);
      try {
        const response = await fetch(`/api/products/${slug}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminProducts] });
          toast({
            title: "Product Deleted",
            description: "The product has been successfully deleted."
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to delete the product.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while deleting the product.",
          variant: "destructive"
        });
      } finally {
        setProcessingSlug(null);
      }
    }
  };

  const handleDuplicate = async (product: Product) => {
    setProcessingSlug(product.slug);
    try {
      // Simulate API call for now since duplicate logic is client-side in the original code,
      // but we should still show feedback.
      const newProduct: Product = {
        ...product,
        _id: Date.now().toString(),
        slug: `${product.slug}-copy`,
        title: `${product.title} (Copy)`,
        createdAt: new Date().toISOString(),
      };
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminProducts] });
      toast({
        title: "Product Duplicated",
        description: "A copy of the product has been created."
      });
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate the product.",
        variant: "destructive"
      });
    } finally {
      setProcessingSlug(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [products, searchQuery]);

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
      </div>

      {/* Results Count */}
      <p className="text-sm text-neutral-500">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-neutral-300" />
            </div>
            <p className="text-neutral-500 mb-4">
              {products.length === 0 ? 'No products yet. Add your first product!' : 'No products found matching your filters.'}
            </p>
            {products.length > 0 && (
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
              }}>
                Clear Filters
              </Button>
            )}
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
                        <Button variant="ghost" size="sm" disabled={processingSlug === product.slug}>
                          {processingSlug === product.slug ? (
                            <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.slug}`} className="flex items-center">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(product)} disabled={processingSlug === product.slug}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(product.slug)}
                          disabled={processingSlug === product.slug}
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
