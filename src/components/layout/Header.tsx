"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Gift, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

  return (
    <>
      <header className="bg-white">
        {/* Top Logo Section (Static) */}
        <div className="layout-inner pt-2 md:pt-4">
          <div className="w-full flex items-center justify-center relative pb-2 md:pb-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-extrabold text-neutral-900 font-nunito text-xl hover:opacity-80 transition-opacity"
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

            {/* Mobile menu button */}
            <button
              type="button"
              className="absolute right-0 inline-flex md:hidden items-center justify-center rounded-full p-2.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
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
      </header>

      {/* Desktop Navigation (Sticky) */}
      <div className="sticky top-0 z-50 hidden md:block w-full bg-white/90 backdrop-blur-md">
        <nav className="layout-inner pb-4 pt-2" aria-label="Main navigation">
          <div className="flex md:items-center md:justify-center md:gap-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-extrabold text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100/80 transition-all font-nunito"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/gift"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold text-white bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors font-nunito ml-2"
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
              className="block px-4 py-3 text-base font-extrabold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-2xl font-nunito"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/gift"
            className="flex items-center gap-2 px-4 py-3 text-base font-extrabold text-white bg-neutral-900 rounded-2xl mt-2 font-nunito"
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
