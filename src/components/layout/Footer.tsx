import Link from 'next/link';
import { Facebook, Instagram, Gift, Heart, Palette, Youtube } from 'lucide-react';

const TikTok = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const Pinterest = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.433 2.977 7.433 6.953 0 4.155-2.616 7.493-6.251 7.493-1.22 0-2.368-.636-2.763-1.385l-.756 2.872c-.274 1.042-1.018 2.348-1.518 3.143 1.166.353 2.405.544 3.684.544 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.638 0 12.017 0z" />
  </svg>
);

const footerLinks = {
  books: [
    { name: 'All Books', href: '/books' },
    { name: 'Latest Releases', href: '/books?sort=newest' },
    { name: 'Most Popular', href: '/books?sort=popular' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    // { name: 'Blog', href: '/blog' },
    // { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Secret', href: '/secret', highlight: true },
    { name: 'Gift', href: '/gift', highlight: true },
    { name: 'FAQ', href: '/faq' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-neutral-900 text-white mt-auto overflow-hidden">
      {/* Decorative mosaic pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-(--mosaic-coral)" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-(--mosaic-teal)" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-(--mosaic-purple)" />
      </div>

      <div className="relative layout-inner py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 lg:gap-12">


          {/* Books Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
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
                      ? 'text-(--mosaic-gold) hover:text-(--mosaic-coral)'
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
              <Heart className="h-4 w-4 text-(--mosaic-rose)" />
              Contact
            </h3>
            <p className="mt-4 text-sm text-neutral-400">
              Email us at <a href="mailto:noblemosaic@gmail.com" className="text-orange-500 hover:underline">noblemosaic@gmail.com</a>
            </p>
            <div className="lg:col-span-1">
              <div className="mt-6 flex gap-4">
                <a href="https://www.facebook.com/noblemosaiccoloring" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-(--mosaic-coral) flex items-center justify-center transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/noblemosaic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-(--mosaic-coral) flex items-center justify-center transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://www.tiktok.com/@noblemosaic" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-(--mosaic-coral) flex items-center justify-center transition-colors">
                  <TikTok className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/@noblemosaic" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-(--mosaic-coral) flex items-center justify-center transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="https://www.pinterest.com/noblemosaic/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-(--mosaic-coral) flex items-center justify-center transition-colors">
                  <Pinterest className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
