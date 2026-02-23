"use client";

import Link from "next/link";
import Image from "next/image";
import { useSecretBooks } from "@/hooks/api/useSecrets";
import { Lock, LockOpen, ArrowRight, Loader2, KeyRound } from "lucide-react";
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
      books.forEach((book: SecretBook) => {
        if (localStorage.getItem(`secret_key_${book.slug}`)) {
          unlockedStatus[book.slug] = true;
        }
      });
      setUnlockedBooks(unlockedStatus);
    }
  }, [books]);

  const unlockedCount = Object.values(unlockedBooks).filter(Boolean).length;

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/[0.02] via-transparent to-[var(--mosaic-teal)]/5" />
      <div className="absolute top-20 right-20 w-48 h-48 bg-[var(--mosaic-teal)]/8 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-36 h-36 bg-[var(--mosaic-purple)]/6 rounded-full blur-3xl" />

      <div className="layout-inner relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--mosaic-teal)]/10 to-neutral-900/5 text-neutral-700 px-4 py-2 rounded-full text-sm font-semibold">
              <KeyRound className="h-4 w-4 text-[var(--mosaic-teal)]" />
              Secret Pages
            </div>
            {unlockedCount > 0 && (
              <span className="text-sm text-neutral-500">
                {unlockedCount}/{books.length} unlocked
              </span>
            )}
          </div>
          <Link
            href="/secret"
            className="text-base font-medium text-neutral-600 hover:text-neutral-900 border-b border-neutral-600 pb-0.5 transition-colors"
            aria-label="View all Secrets"
          >
            View more
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-nunito leading-tight">
              Unlock Hidden{" "}
              <span className="bg-gradient-to-r from-[var(--mosaic-teal)] to-neutral-700 bg-clip-text text-transparent">
                Coloring Secrets
              </span>
            </h2>

            <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
              Each book contains a secret key that unlocks exclusive bonus
              coloring pages. Find the key in your book and discover hidden
              treasures!
            </p>

            <Link
              href="/secret"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full text-sm font-bold font-nunito hover:bg-neutral-800 transition-colors group shadow-lg shadow-neutral-900/10"
            >
              <Lock className="h-4 w-4" />
              Explore Secrets
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Book Cards Preview */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
              </div>
            ) : previewBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {previewBooks.map((book, index) => (
                  <Link
                    href={`/secret/${book.slug}`}
                    key={book._id}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1 bg-neutral-100">
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
                      <div className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[var(--mosaic-teal)] transition-colors">
                        {unlockedBooks[book.slug] ? (
                          <LockOpen className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-neutral-800 group-hover:text-[var(--mosaic-teal)] transition-colors line-clamp-1 font-nunito">
                      {book.title}
                    </h3>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-neutral-50 to-white rounded-3xl border border-neutral-100">
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-200">
                  <Lock className="h-8 w-8 text-neutral-300" />
                </div>
                <p className="text-neutral-500 text-base">
                  Secret pages coming soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
