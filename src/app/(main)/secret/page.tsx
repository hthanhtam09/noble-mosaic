'use client';

import { useState, useEffect } from 'react';
import { useSecretBooks } from '@/hooks/api/useSecrets';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Loader2, Lock, LockOpen, X, Heart, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/store/use-wishlist';
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
  const [mounted, setMounted] = useState(false);

  const { addItem, removeItem, isInWishlist } = useWishlist();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
    <>
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

      <div className="grow">
        <div className="layout-inner pt-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4 text-center">Secret</h1>
          <hr className="border-neutral-200 mb-8" />

          {/* Filters Bar */}
          {!isLoading && books.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 items-center justify-end mb-8 pb-4 border-b border-neutral-100">
              <div className="flex flex-wrap items-center justify-center gap-3 order-1 md:order-2 w-full md:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-50 rounded-xl border-neutral-200 bg-white">
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
                  <SelectTrigger className="w-32 rounded-xl border-neutral-200 bg-white text-xs">
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
                <div className="w-20 h-20 bg-linear-to-br from-neutral-100 to-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-200">
                  <Lock className="h-10 w-10 text-neutral-300" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-2">No Secrets Revealed Yet</h3>
                <p className="text-neutral-500 text-lg">Check back later for hidden images from our collections!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10 [content-visibility:auto]">
                  {displayedBooks.map((book, index) => (
                    <div key={book._id} className="flex flex-col items-center group/card">
                      <Link href={`/secret/${book.slug}`} className="group relative w-full transition-[transform] duration-500 hover:-translate-y-2 block transform-gpu">
                        <div className="relative aspect-3/4 overflow-hidden rounded-2xl shadow-sm group-hover/card:shadow-xl group-hover/card:shadow-orange-500/10 transition-all duration-500">
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-linear-to-t from-neutral-900/60 via-neutral-900/20 to-transparent z-10 opacity-40 group-hover:opacity-60 transition-opacity" />

                          <Image
                            src={book.coverImage}
                            alt={book.title}
                            fill
                            priority={index < 4}
                            className="object-cover transition-transform duration-700 group-hover:scale-110 transform-gpu"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                          />

                          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center">
                            <div className={cn(
                              "text-xs px-2 py-1 rounded-md backdrop-blur-md text-white font-medium flex items-center gap-1.5 transition-colors",
                              unlockedBooks[book.slug] ? "bg-green-500/80" : "bg-black/60"
                            )}>
                              {unlockedBooks[book.slug] ? (
                                <>
                                  <LockOpen className="h-3 w-3" />
                                  <span>Unlocked</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3 w-3" />
                                  <span>Locked</span>
                                </>
                              )}
                            </div>
                            
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                               <ArrowLeft className="h-4 w-4 rotate-180" />
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (!mounted) return;
                              if (isInWishlist(book._id)) {
                                removeItem(book._id);
                              } else {
                                addItem({
                                  _id: book._id,
                                  title: book.title,
                                  slug: `/secret/${book.slug}`, // point to secret instead
                                  coverImage: book.coverImage,
                                });
                              }
                            }}
                            className={cn(
                              "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-20",
                              mounted && isInWishlist(book._id)
                                ? "bg-orange-50 text-orange-500 shadow-orange-200/50"
                                : "bg-white/80 text-neutral-400 hover:text-orange-500 hover:bg-white shadow-black/5",
                              "shadow-md hover:scale-110 active:scale-95"
                            )}
                          >
                            <Heart className={cn("h-4 w-4", mounted && isInWishlist(book._id) && "fill-current")} />
                          </button>
                        </div>
                      </Link>
                      <div className="p-3 text-center w-full max-w-[200px] sm:max-w-[240px]">
                        <Link href={`/secret/${book.slug}`} className="group">
                          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-(--mosaic-teal) transition-colors line-clamp-2 mb-1">
                            {book.title}
                          </h3>
                        </Link>
                      </div>
                    </div>
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
      </div>
    </>
  );
}
