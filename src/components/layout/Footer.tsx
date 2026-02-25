import Link from 'next/link';
import { Facebook, Instagram, Twitter, Gift, Heart, Palette } from 'lucide-react';

const footerLinks = {
  books: [
    { name: 'All Books', href: '/books' },
    { name: 'Animals', href: '/books?theme=Animals' },
    { name: 'Flowers', href: '/books?theme=Flowers' },
    { name: 'Mandala', href: '/books?theme=Mandala' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Secret', href: '/secret', highlight: true },
    { name: 'Gift', href: '/gift', highlight: true },
    { name: 'FAQ', href: '/contact' },
    { name: 'Shipping', href: '/contact' },
  ],
};

const colorDots = [
  { color: 'var(--mosaic-coral)' },
  { color: 'var(--mosaic-gold)' },
  { color: 'var(--mosaic-teal)' },
  { color: 'var(--mosaic-purple)' },
  { color: 'var(--mosaic-rose)' },
];

export default function Footer() {
  return (
    <footer className="relative bg-neutral-900 text-white mt-auto overflow-hidden">
      {/* Decorative mosaic pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[var(--mosaic-coral)]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[var(--mosaic-teal)]" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-[var(--mosaic-purple)]" />
      </div>

      <div className="relative layout-inner py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            {/* Color palette */}
            <div className="flex gap-2">
              {colorDots.map((dot, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-md shadow-inner"
                  style={{ backgroundColor: dot.color }}
                />
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-[var(--mosaic-coral)] flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-[var(--mosaic-purple)] flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-[var(--mosaic-teal)] flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Books Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <Palette className="h-4 w-4 text-[var(--mosaic-gold)]" />
              Books
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.books.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* Resources Links */}
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-all flex items-center gap-2 ${link.highlight
                      ? 'text-[var(--mosaic-gold)] hover:text-[var(--mosaic-coral)]'
                      : 'text-neutral-400 hover:text-white hover:translate-x-1'
                      }`}
                  >
                    {link.highlight && <Gift className="h-4 w-4" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <Heart className="h-4 w-4 text-[var(--mosaic-rose)]" />
              Stay Updated
            </h3>
            <p className="mt-4 text-sm text-neutral-400">
              Subscribe for new releases and exclusive offers.
            </p>
            <form className="mt-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 text-sm bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:border-[var(--mosaic-teal)] text-white placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] text-white rounded-xl hover:shadow-lg hover:shadow-[var(--mosaic-purple)]/25 transition-all"
                >
                  Join
                </button>
              </div>
            </form>

            {/* Gift Promo */}
            <div className="mt-6 p-4 bg-gradient-to-br from-neutral-800 to-neutral-800/50 rounded-xl border border-neutral-700">
              <div className="flex items-center gap-2 text-[var(--mosaic-gold)] mb-2">
                <Gift className="h-5 w-5" />
                <span className="font-medium text-sm">Gift</span>
              </div>
              <p className="text-xs text-neutral-400 mb-3">
                Get your gift when you subscribe!
              </p>
              <Link
                href="/gift"
                className="inline-flex items-center gap-2 text-xs font-medium text-white bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-gold)] px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Download Now
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-400 flex items-center gap-2">
              Made with <Heart className="h-4 w-4 text-[var(--mosaic-rose)] fill-[var(--mosaic-rose)]" /> by Noble Mosaic
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Noble Mosaic
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
