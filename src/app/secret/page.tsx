'use client';

import { useState, useEffect } from 'react';
import { useSecretBooks } from '@/hooks/api/useSecrets';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, LockOpen, Palette } from 'lucide-react';
import { CollectionPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

interface SecretBook {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
}

export default function SecretPage() {
  const { data: books = [], isLoading } = useSecretBooks();

  const [unlockedBooks, setUnlockedBooks] = useState<Record<string, boolean>>({});
  const [displayLimit, setDisplayLimit] = useState(12);

  const displayedBooks = books.slice(0, displayLimit);

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
        {/* Books Grid */}
        <section className="py-16">
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

                {books.length > displayLimit && (
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
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Discover All Our Books
            </h2>
            <p className="text-lg text-neutral-500 mb-8">
              Want to see the full collection? Browse our books for all mosaic color by number books.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-neutral-800 to-neutral-700 text-white hover:opacity-90 rounded-full px-8 shadow-xl shadow-neutral-200"
            >
              <Link href="/books">
                <Palette className="mr-2 h-5 w-5" />
                Explore Books
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
