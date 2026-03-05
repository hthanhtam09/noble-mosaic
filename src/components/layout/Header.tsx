"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Gift, Lock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useWishlist } from "@/store/use-wishlist";
import { useEffect } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Books", href: "/books" },
  { name: "Secret", href: "/secret" },
  // { name: "About", href: "/about" },
  // { name: "Blog", href: "/blog" },
  // { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wishlistItems = useWishlist((state) => state.items);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      <header className="bg-white">
        {/* Top Logo Section (Static) */}
        <div className="layout-inner pt-2 md:pt-4">
          <div className="w-full flex items-center justify-center relative pb-2 md:pb-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-extrabold text-neutral-900 text-xl hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="Noble Mosaic"
                width={500}
                height={100}
                unoptimized
                className="h-16 md:h-20 w-auto"
                priority
              />
            </Link>

            <div className="absolute right-0 flex items-center pr-2 md:pr-4">
              <Link
                href="/wishlist"
                className="relative p-2 text-neutral-600 hover:bg-rose-50 hover:text-rose-500 transition-colors rounded-full"
                aria-label="Wishlist"
              >
                <Heart className="h-6 w-6" />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center -translate-x-0 translate-y-0 border border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex md:hidden items-center justify-center rounded-full p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 ml-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation (Sticky) */}
      <div className="sticky top-0 z-50 hidden md:block w-full bg-white/90 backdrop-blur-md">
        <nav className="layout-inner pb-4 pt-2" aria-label="Main navigation">
          <div className="flex md:items-center md:justify-center md:gap-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-extrabold text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100/80 transition-all"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/gift"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold text-white bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors ml-2"
            >
              <Gift className="h-4 w-4" />
              Gift
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-200 ease-in-out overflow-hidden relative z-40",
          mobileMenuOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="space-y-1 px-4 pb-4 pt-2 bg-white/98 backdrop-blur-sm border-t border-neutral-100">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-3 text-base font-extrabold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-2xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/gift"
            className="flex items-center gap-2 px-4 py-3 text-base font-extrabold text-white bg-neutral-900 rounded-2xl mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Gift className="h-5 w-5" />
            Gift
          </Link>
        </div>
      </div>
    </>
  );
}
