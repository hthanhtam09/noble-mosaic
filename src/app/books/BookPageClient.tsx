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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useFilterPagination } from '@/hooks/useFilterPagination';

function BookContent() {
  const { data: products = [], isLoading } = useProducts();

  const {
    sortBy, setSortBy, itemsPerPage, setItemsPerPage,
    currentPage, setCurrentPage, clearFilters, hasActiveFilters,
    filteredItems: filteredProducts,
    displayedItems: displayedProducts,
    totalPages
  } = useFilterPagination(products);

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
          <h1 className="text-3xl font-bold text-neutral-900 mb-4 text-center">Books</h1>
          <hr className="border-neutral-200 mb-8" />

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end mb-6 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] rounded-xl border-neutral-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date: Newest to Oldest</SelectItem>
                  <SelectItem value="date-asc">Date: Oldest to Newest</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="alpha-asc">Name: A to Z</SelectItem>
                  <SelectItem value="alpha-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>

              {/* Items Per Page */}
              <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                <SelectTrigger className="w-[140px] rounded-xl border-neutral-200">
                  <SelectValue placeholder="Items Per Page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="30">30 per page</SelectItem>
                  <SelectItem value="40">40 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
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
                grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
              `}>
                {displayedProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} priority={index < 4} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink 
                                isActive={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          page === currentPage - 2 || 
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
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
