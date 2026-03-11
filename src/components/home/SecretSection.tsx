"use client";

import Link from "next/link";
import Image from "next/image";
import { useSecretBooks } from "@/hooks/api/useSecrets";
import { Lock, LockOpen, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface SecretBook {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
}

export default function SecretSection() {
  const { data: books = [], isLoading } = useSecretBooks();
  const [unlockedBooks, setUnlockedBooks] = useState<Record<string, boolean>>(
    {}
  );

  const previewBooks = books.slice(0, 4);

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
      // Also check if we lost any
      if (Object.keys(unlockedStatus).length !== Object.keys(unlockedBooks).length) {
        hasChanges = true;
      }

      if (hasChanges) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUnlockedBooks(unlockedStatus);
      }
    }
  }, [books, unlockedBooks]);

  return (
    <section className="py-12 md:py-16">
      <div className="layout-inner">
        <div className="flex flex-col items-center justify-center gap-3 mb-2">
          <div className="flex items-baseline gap-3 justify-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-800 text-center">
              Secret Pages
            </h2>
          </div>
          <Link
            href="/secret"
            className="text-sm md:text-base font-medium text-neutral-600 hover:text-neutral-900 border-b border-neutral-600 pb-0.5 transition-colors"
            aria-label="View all Secrets"
          >
            View more
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        ) : previewBooks.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {previewBooks.map((book, index) => (
              <div
                key={book._id}
                className="w-[160px] sm:w-[200px] flex flex-col items-center"
              >
                <Link href={`/secret/${book.slug}`} className="group relative w-full max-w-[200px] sm:max-w-[240px] transition-all duration-500 hover:-translate-y-1 block">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 15vw"
                    priority={index < 2}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity z-10" />

                  {/* Lock icon */}
                  <div className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[var(--mosaic-teal)] transition-colors shadow-sm">
                    {unlockedBooks[book.slug] ? (
                      <LockOpen className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  </div>
                </Link>

                <div className="p-3 text-center w-full max-w-[200px] sm:max-w-[240px]">
                  <Link href={`/secret/${book.slug}`} className="group">
                    <h3 className="text-[13px] sm:text-sm font-bold text-neutral-800 group-hover:text-[var(--mosaic-teal)] transition-colors line-clamp-1 mb-1">
                      {book.title}
                    </h3>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-12">
            Secret pages coming soon!
          </p>
        )}
      </div>
    </section>
  );
}
