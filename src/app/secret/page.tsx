'use client';

import { useState, useEffect } from 'react';
import { useSecretBooks } from '@/hooks/api/useSecrets';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, LockOpen, X } from 'lucide-react';
import { CollectionPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilterPagination } from '@/hooks/useFilterPagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SecretBook {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
}

export default function SecretPage() {
  const { data: books = [], isLoading } = useSecretBooks();

  const [unlockedBooks, setUnlockedBooks] = useState<Record<string, boolean>>({});

  const {
    sortBy, setSortBy, itemsPerPage, setItemsPerPage,
    currentPage, setCurrentPage, clearFilters, hasActiveFilters,
    filteredItems: filteredBooks,
    displayedItems: displayedBooks,
    totalPages
  } = useFilterPagination(books, '20');

  useEffect(() => {
    if (books.length > 0) {
      const unlockedStatus: Record<string, boolean> = {};
      let hasChanges = false;
      books.forEach((book: SecretBook) => {
        if (localStorage.getItem(`secret_key_${book.slug}`)) {
          unlockedStatus[book.slug] = true;
          if (!unlockedBooks[book.slug]) hasChanges = true;
        }
      });
      if (Object.keys(unlockedStatus).length !== Object.keys(unlockedBooks).length) {
        hasChanges = true;
      }
      if (hasChanges) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUnlockedBooks(unlockedStatus);
      }
    }
  }, [books]);

  return (
    <div className="min-h-screen flex flex-col">
      <CollectionPageJsonLd
        name="Secret Hidden Images"
        description="Unlock secret hidden images from our mosaic color by number books. Enter your secret key to reveal the final colored masterpieces."
        url="https://noblemosaic.com/secret"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Secret', url: 'https://noblemosaic.com/secret' },
        ]}
      />
      <Header />

      <main className="flex-grow">
        <div className="layout-inner pt-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4 text-center">Secret</h1>
          <hr className="border-neutral-200 mb-8" />

          {/* Filters Bar */}
          {!isLoading && books.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end mb-8 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px] rounded-xl border-neutral-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc" >Date: Newest to Oldest</SelectItem>
                    <SelectItem value="date-asc" >Date: Oldest to Newest</SelectItem>
                    <SelectItem value="alpha-asc" >Name: A to Z</SelectItem>
                    <SelectItem value="alpha-desc" >Name: Z to A</SelectItem>
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
          )}

          {!isLoading && books.length > 0 && (
            <p className="text-sm text-neutral-500 mb-6">
              Showing <span className="font-medium text-neutral-900">{displayedBooks.length}</span> of <span className="font-medium text-neutral-900">{filteredBooks.length}</span> book{filteredBooks.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Books Grid */}
        <section className="pb-16">
          <div className="layout-inner">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-200">
                  <Lock className="h-10 w-10 text-neutral-300" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-2">No Secrets Revealed Yet</h3>
                <p className="text-neutral-500 text-lg">Check back later for hidden images from our collections!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {displayedBooks.map((book, index) => (
                    <Link href={`/secret/${book.slug}`} key={book._id} className="group block">
                      <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden bg-white/80 backdrop-blur-sm group-hover:-translate-y-1">
                        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />

                          <Image
                            src={book.coverImage}
                            alt={book.title}
                            fill
                            priority={index < 4}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />

                          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-end items-end">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[var(--mosaic-teal)] transition-colors">
                              {unlockedBooks[book.slug] ? (
                                <LockOpen className="h-4 w-4" />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[var(--mosaic-teal)] transition-colors line-clamp-2 mb-2">
                            {book.title}
                          </h3>
                          <p className="text-sm text-neutral-500 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
                            Click to reveal secrets <span className="text-[var(--mosaic-coral)]">→</span>
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
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
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
