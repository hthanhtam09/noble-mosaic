"use client";

import Link from "next/link";
import Image from "next/image";
import { useSecretBooks } from "@/hooks/api/useSecrets";
import { Lock, LockOpen, Loader2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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

  const previewBooks = books.slice(0, 5);

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
          <div className="flex items-center gap-2 justify-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-800 text-center">
              Secret Pages
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center p-1 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors cursor-help">
                  <HelpCircle className="h-5 w-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-center border bg-white text-neutral-800 shadow-sm z-50">
                <p>See the answers and final picture. Don’t peek too early 👀</p>
              </TooltipContent>
            </Tooltip>
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 mt-6">
            {previewBooks.map((book, index) => (
              <div
                key={book._id}
                className="p-2 flex flex-col items-center"
              >
                <div className="relative w-full max-w-[200px] sm:max-w-[240px]">
                  <Link href={`/secret/${book.slug}`} className="group block aspect-[3/4] relative overflow-hidden rounded-2xl">
                    <div className="relative w-full h-full">
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 2}
                      />
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  </Link>

                  {/* Lock icon */}
                  <div className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-neutral-600 shadow-sm pointer-events-none group-hover:text-[var(--mosaic-teal)] transition-colors">
                    {unlockedBooks[book.slug] ? (
                      <LockOpen className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                </div>

                <div className="p-3 text-center w-full max-w-[200px] sm:max-w-[240px]">
                  <Link href={`/secret/${book.slug}`} className="group">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-[var(--mosaic-teal)] transition-colors line-clamp-2 mb-1">
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
