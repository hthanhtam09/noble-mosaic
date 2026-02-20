'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Mail, CheckCircle, Loader2, Gift, 
  Palette, Lock, Unlock, Heart, Sparkles
} from 'lucide-react';

const freePages = [
  {
    id: '1',
    title: 'Mandala Sampler',
    description: 'Beautiful beginner-friendly mandala design',
    thumbnail: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=300&h=400&fit=crop',
    downloadUrl: '#download-1',
    difficulty: 'Beginner',
    color: 'var(--mosaic-purple)',
  },
  {
    id: '2',
    title: 'Floral Pattern',
    description: 'Elegant flower mosaic to color',
    thumbnail: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?w=300&h=400&fit=crop',
    downloadUrl: '#download-2',
    difficulty: 'Beginner',
    color: 'var(--mosaic-rose)',
  },
  {
    id: '3',
    title: 'Animal Kingdom',
    description: 'Cute animal mosaic design',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=400&fit=crop',
    downloadUrl: '#download-3',
    difficulty: 'Easy',
    color: 'var(--mosaic-coral)',
  },
  {
    id: '4',
    title: 'Geometric Shapes',
    description: 'Modern geometric pattern',
    thumbnail: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=400&fit=crop',
    downloadUrl: '#download-4',
    difficulty: 'Intermediate',
    color: 'var(--mosaic-teal)',
  },
  {
    id: '5',
    title: 'Nature Scene',
    description: 'Peaceful nature mosaic',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=400&fit=crop',
    downloadUrl: '#download-5',
    difficulty: 'Beginner',
    color: 'var(--mosaic-sage)',
  },
  {
    id: '6',
    title: 'Abstract Art',
    description: 'Creative abstract design',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=400&fit=crop',
    downloadUrl: '#download-6',
    difficulty: 'Intermediate',
    color: 'var(--mosaic-gold)',
  },
];

export default function FreeDownloadsPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'free-downloads' 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (pageId: string, pageTitle: string) => {
    alert(`Download started: ${pageTitle}\n\nIn production, this would download the actual coloring page PDF.`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="mosaic-hero py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-[var(--mosaic-coral)] via-[var(--mosaic-gold)] to-[var(--mosaic-teal)] rounded-full blur opacity-40" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] rounded-full flex items-center justify-center">
                  <Gift className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
              Free Coloring Pages
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter and get instant access to beautiful mosaic coloring pages 
              – completely free!
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
              {[
                { icon: Palette, text: '6 Free Pages' },
                { icon: Download, text: 'Printable PDF' },
                { icon: Sparkles, text: 'New Pages Monthly' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <item.icon className="h-5 w-5" style={{ color: ['var(--mosaic-coral)', 'var(--mosaic-teal)', 'var(--mosaic-purple)'][index] }} />
                  <span className="text-sm font-medium text-neutral-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscription Form */}
        {!isSubscribed ? (
          <section className="py-12 bg-white">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
              <Card className="border-2 border-neutral-100 shadow-xl overflow-hidden">
                {/* Color accent bar */}
                <div className="h-2 bg-gradient-to-r from-[var(--mosaic-coral)] via-[var(--mosaic-gold)] via-[var(--mosaic-teal)] to-[var(--mosaic-purple)]" />
                
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Lock className="h-8 w-8 text-neutral-400" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
                      Unlock Your Free Downloads
                    </h2>
                    <p className="text-neutral-600">
                      Enter your email to get instant access to all free coloring pages
                    </p>
                  </div>

                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 text-lg rounded-xl border-2 focus:border-[var(--mosaic-purple)]"
                        required
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-xl">{error}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] hover:opacity-90 text-white rounded-xl shadow-lg shadow-[var(--mosaic-purple)]/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-5 w-5" />
                          Unlock Free Downloads
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-neutral-500">
                      By subscribing, you agree to receive occasional emails from Noble Mosaic. 
                      We respect your privacy.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        ) : (
          <section className="py-12 bg-gradient-to-r from-[var(--mosaic-teal)] to-[var(--mosaic-purple)]">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center text-white">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2">
                You&apos;re In! 🎉
              </h2>
              <p className="text-white/90 mb-4">
                Thank you for subscribing! Your free coloring pages are now unlocked below.
              </p>
              <p className="text-sm text-white/70">
                Check your inbox for a confirmation email and more free content!
              </p>
            </div>
          </section>
        )}

        {/* Free Pages Grid */}
        <section className={`py-16 ${isSubscribed ? 'bg-white' : 'bg-neutral-50'}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-4">
                {isSubscribed ? 'Download Your Free Pages' : 'Preview: Free Coloring Pages'}
              </h2>
              <p className="text-neutral-600">
                {isSubscribed 
                  ? 'Click on any page to download the printable PDF'
                  : 'Subscribe above to unlock all downloads'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {freePages.map((page) => (
                <div 
                  key={page.id} 
                  className={`mosaic-card group relative overflow-hidden transition-all duration-300 ${
                    isSubscribed 
                      ? 'cursor-pointer' 
                      : 'opacity-70 grayscale'
                  }`}
                  onClick={() => isSubscribed && handleDownload(page.id, page.title)}
                >
                  <div className="relative aspect-[3/4]">
                    <img
                      src={page.thumbnail}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Color overlay on hover */}
                    <div 
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isSubscribed ? '' : 'hidden'
                      }`}
                      style={{ background: `linear-gradient(135deg, ${page.color}40, transparent)` }}
                    />
                    
                    {!isSubscribed && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                          <Lock className="h-8 w-8 text-neutral-500" />
                        </div>
                      </div>
                    )}
                    
                    {isSubscribed && (
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                          <Download className="h-8 w-8" style={{ color: page.color }} />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-neutral-900">{page.title}</h3>
                        <p className="text-sm text-neutral-500">{page.description}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs shrink-0 rounded-lg"
                        style={{ borderColor: page.color, color: page.color }}
                      >
                        {page.difficulty}
                      </Badge>
                    </div>
                    
                    {isSubscribed && (
                      <Button 
                        className="w-full mt-3 text-white rounded-xl"
                        style={{ backgroundColor: page.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(page.id, page.title);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                  </CardContent>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center gap-2 mb-6">
              {['var(--mosaic-coral)', 'var(--mosaic-gold)', 'var(--mosaic-teal)'].map((color, i) => (
                <div key={i} className="w-6 h-6 rounded-lg" style={{ backgroundColor: color }} />
              ))}
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">
              Want More Coloring Pages?
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              Check out our complete collection of mosaic color by number books on Amazon
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] text-white hover:opacity-90 rounded-full px-8"
            >
              <a href="/shop">
                <Palette className="mr-2 h-5 w-5" />
                Shop All Books
              </a>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
