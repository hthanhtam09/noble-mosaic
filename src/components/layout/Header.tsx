'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Gift, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Secret', href: '/secret' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-neutral-200/50">
      {/* Color accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--mosaic-coral)] via-[var(--mosaic-gold)] via-[var(--mosaic-teal)] to-[var(--mosaic-purple)]" />
      
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Noble Mosaic"
                  width={500}
                  height={100}
                  unoptimized
                  className="h-20 w-auto md:h-28 transition-transform group-hover:scale-105"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100/50 transition-all"
              >
                {item.name}
              </Link>
            ))}
            {/* Gift - Highlighted */}
            <Link
              href="/gift"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] rounded-full hover:shadow-lg hover:shadow-[var(--mosaic-coral)]/25 transition-all"
            >
              <Gift className="h-4 w-4" />
              Gift
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden transition-all duration-200 ease-in-out overflow-hidden',
          mobileMenuOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="space-y-1 px-4 pb-4 pt-2 bg-white/95 backdrop-blur-sm border-t border-neutral-100">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-3 text-base font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {/* Gift - Mobile */}
          <Link
            href="/gift"
            className="flex items-center gap-2 px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] rounded-xl mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Gift className="h-5 w-5" />
            Gift
          </Link>
          <div className="mt-4">
            <Button asChild className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl">
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
                Shop Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
