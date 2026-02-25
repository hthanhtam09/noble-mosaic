'use client';

import { useState, useEffect } from 'react';
import { useGiftLinks } from '@/hooks/api/useGift';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, Mail, Loader2, 
  Palette, Lock,
  ShieldCheck, ExternalLink, Gift
} from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';



export default function GiftPageClient() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { data: giftLinks = [], isLoading } = useGiftLinks();

  useEffect(() => {
    if (localStorage.getItem('gift_verified') === 'true') {
      setIsSubscribed(true);
    }
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('verify');
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribers', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, source: 'gift', code })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        localStorage.setItem('gift_verified', 'true');
        toast({
          title: "You're In! 🎉",
          description: 'Your gift is now unlocked. Enjoy your free downloads!',
        });
      } else {
        setError(data.error || 'Invalid or expired code');
      }
    } catch {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const colorVars = [
    'var(--mosaic-coral)',
    'var(--mosaic-purple)',
    'var(--mosaic-teal)',
    'var(--mosaic-gold)',
    'var(--mosaic-sage)',
    'var(--mosaic-rose)',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Gift', url: 'https://noblemosaic.com/gift' },
        ]}
      />

      <Header />
      
      <main className="flex-grow">
        {/* SEO heading */}
        <h1 className="sr-only">Free Mosaic Coloring Books - Download Your Gift</h1>

        {/* Subscription Form — only shown if not subscribed */}
        {!isSubscribed && (
          <section className="py-12 bg-white">
            <div className="mx-auto max-w-xl">
              <Card className="border-2 border-neutral-100 shadow-xl overflow-hidden">
                {/* Color accent bar */}
                <div className="h-2 bg-gradient-to-r from-[var(--mosaic-coral)] via-[var(--mosaic-gold)] via-[var(--mosaic-teal)] to-[var(--mosaic-purple)]" />
                
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Lock className="h-8 w-8 text-neutral-400" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
                      Unlock Your Gift
                    </h2>
                    <p className="text-neutral-600">
                      Enter your email to get instant access to your gift
                    </p>
                  </div>

                  {step === 'email' ? (
                    <form onSubmit={handleSendCode} className="space-y-4">
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
                            Sending Code...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-5 w-5" />
                            Send Verification Code
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-center text-neutral-500">
                        By requesting a code, you agree to receive occasional emails from Noble Mosaic. 
                        We respect your privacy.
                      </p>
                    </form>
                  ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                      <div className="text-center mb-6">
                        <p className="text-sm text-neutral-600">
                          We've sent a 6-digit code to <br />
                          <strong className="text-neutral-900">{email}</strong>
                        </p>
                        <p className="text-xs text-neutral-400 mt-2">
                          If you don't see the email, please check your <strong className="text-neutral-500">Spam</strong> or <strong className="text-neutral-500">Junk</strong> folder.
                        </p>
                      </div>
                      
                      <div className="flex justify-center mb-2">
                        <Input
                          type="text"
                          maxLength={6}
                          placeholder="000000"
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full max-w-[240px] h-16 text-center text-3xl tracking-[0.3em] font-mono rounded-xl border-2 focus:border-[var(--mosaic-purple)] bg-white"
                          required
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-xl">{error}</p>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting || code.length !== 6}
                        className="w-full h-14 text-lg bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] hover:opacity-90 text-white rounded-xl shadow-lg shadow-[var(--mosaic-purple)]/20"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="mr-2 h-5 w-5" />
                            Verify & Unlock Gift
                          </>
                        )}
                      </Button>
                      
                      <div className="text-center mt-4">
                        <button 
                          type="button" 
                          onClick={() => { setStep('email'); setError(''); setCode(''); }}
                          className="text-sm text-neutral-500 hover:text-neutral-900 underline"
                        >
                          Change email address
                        </button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Gift Links Section */}
        <section className={`py-16 ${isSubscribed ? 'bg-white' : 'bg-neutral-50'}`}>
          <div className="layout-inner">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-4">
                {isSubscribed ? 'Download Your Gift' : 'Preview: Gift'}
              </h2>
              <p className="text-neutral-600">
                {isSubscribed 
                  ? 'Click on any item to download your free coloring book'
                  : 'Subscribe above to unlock all gifts'
                }
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            ) : giftLinks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-[var(--mosaic-coral)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-100">
                  <Gift className="h-10 w-10 text-neutral-300" />
                </div>
                <p className="text-neutral-500 text-lg">No gifts available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {giftLinks.map((link, index) => {
                  const color = colorVars[index % colorVars.length];

                  return (
                    <div 
                      key={link._id} 
                      className={`mosaic-card group relative overflow-hidden transition-all duration-300 rounded-xl ${
                        isSubscribed 
                          ? 'cursor-pointer hover:shadow-lg' 
                          : 'opacity-70 grayscale'
                      }`}
                      onClick={() => isSubscribed && handleOpenLink(link.url)}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-[3/4] bg-neutral-100">
                        {link.thumbnail ? (
                          <Image
                            src={link.thumbnail}
                            alt={link.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-100 to-neutral-50">
                            <Gift className="h-12 w-12 text-neutral-300" />
                          </div>
                        )}
                        
                        {/* Lock overlay when not subscribed */}
                        {!isSubscribed && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                              <Lock className="h-6 w-6 text-neutral-500" />
                            </div>
                          </div>
                        )}
                        
                        {/* Download overlay on hover when subscribed */}
                        {isSubscribed && (
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                              <Download className="h-7 w-7" style={{ color }} />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Info + Download button */}
                      <CardContent className="p-3">
                        <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 mb-1">
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-xs text-neutral-500 line-clamp-1 mb-2">
                            {link.description}
                          </p>
                        )}
                        {isSubscribed && (
                          <Button 
                            className="w-full mt-1 text-white rounded-xl text-xs h-8 group/btn"
                            style={{ backgroundColor: color }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenLink(link.url);
                            }}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                            <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                          </Button>
                        )}
                      </CardContent>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
          <div className="mx-auto max-w-4xl text-center">
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
              <a href="/books">
                <Palette className="mr-2 h-5 w-5" />
                Browse All Books
              </a>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
