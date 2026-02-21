'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Mail, CheckCircle, Loader2, Gift, 
  Palette, Lock, Unlock, Heart, Sparkles,
  FolderOpen, ChevronDown, ChevronUp, FolderHeart
} from 'lucide-react';

interface ColoringFolder {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  pageCount: number;
}

interface ColoringPage {
  _id: string;
  title: string;
  imageUrl: string;
  folder: string;
  order: number;
}

interface FolderWithPages extends ColoringFolder {
  pages: ColoringPage[];
}

export default function FreeDownloadsPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [folders, setFolders] = useState<FolderWithPages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Fetch folders + pages from DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const foldersRes = await fetch('/api/coloring-folders');
        if (!foldersRes.ok) return;
        const foldersData = await foldersRes.json();
        const foldersList = foldersData.folders || [];

        // Fetch pages for each folder
        const foldersWithPages: FolderWithPages[] = await Promise.all(
          foldersList.map(async (folder: ColoringFolder) => {
            const pagesRes = await fetch(`/api/coloring-folders/${folder._id}`);
            if (pagesRes.ok) {
              const pagesData = await pagesRes.json();
              return { ...folder, pages: pagesData.pages || [] };
            }
            return { ...folder, pages: [] };
          })
        );

        setFolders(foldersWithPages);
        // Initialize all folders as expanded
        setExpandedFolders(new Set(foldersWithPages.map((f: FolderWithPages) => f._id)));
      } catch (error) {
        console.error('Error fetching coloring data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = folders.reduce((sum, f) => sum + f.pages.length, 0);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

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

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback
      window.open(imageUrl, '_blank');
    }
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
                { icon: Palette, text: `${totalPages || '...'} Free Pages` },
                { icon: Download, text: 'Printable Quality' },
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

        {/* Free Pages - Grouped by Folder */}
        <section className={`py-16 ${isSubscribed ? 'bg-white' : 'bg-neutral-50'}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-4">
                {isSubscribed ? 'Download Your Free Pages' : 'Preview: Free Coloring Pages'}
              </h2>
              <p className="text-neutral-600">
                {isSubscribed 
                  ? 'Click on any page to download the printable image'
                  : 'Subscribe above to unlock all downloads'
                }
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            ) : folders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-[var(--mosaic-coral)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-100">
                  <FolderHeart className="h-10 w-10 text-neutral-300" />
                </div>
                <p className="text-neutral-500 text-lg">No coloring pages available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {folders.map((folder) => (
                  <div key={folder._id}>
                    {/* Folder header */}
                    <button
                      onClick={() => toggleFolder(folder._id)}
                      className="w-full flex items-start justify-between group mb-8 text-left gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="relative flex-none shrink-0 w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-gradient-to-br from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] flex items-center justify-center shadow-md shadow-[var(--mosaic-purple)]/20 group-hover:scale-105 transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <FolderHeart className="h-6 w-6 text-white relative z-10" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5 pr-4">
                          <div className="flex items-center gap-3 flex-wrap mb-1.5">
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-neutral-900 group-hover:text-purple-700 transition-colors leading-tight">
                              {folder.name}
                            </h3>
                            <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 shrink-0 flex-none">
                              {folder.pages.length} pages
                            </Badge>
                          </div>
                          {folder.description && (
                            <p className="text-sm md:text-base text-neutral-500 whitespace-normal leading-relaxed">{folder.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-neutral-400 flex-none shrink-0 pt-3">
                        {expandedFolders.has(folder._id) ? (
                          <ChevronUp className="h-6 w-6" />
                        ) : (
                          <ChevronDown className="h-6 w-6" />
                        )}
                      </div>
                    </button>

                    {/* Folder pages grid */}
                    {expandedFolders.has(folder._id) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {folder.pages.map((page) => {
                          const colorVars = [
                            'var(--mosaic-coral)',
                            'var(--mosaic-purple)',
                            'var(--mosaic-teal)',
                            'var(--mosaic-gold)',
                            'var(--mosaic-sage)',
                            'var(--mosaic-rose)',
                          ];
                          const color = colorVars[page.order % colorVars.length];

                          return (
                            <div 
                              key={page._id} 
                              className={`mosaic-card group relative overflow-hidden transition-all duration-300 rounded-xl ${
                                isSubscribed 
                                  ? 'cursor-pointer hover:shadow-lg' 
                                  : 'opacity-70 grayscale'
                              }`}
                              onClick={() => isSubscribed && handleDownload(page.imageUrl, page.title)}
                            >
                              <div className="relative aspect-[3/4] bg-neutral-100">
                                <Image
                                  src={page.imageUrl}
                                  alt={page.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                />
                                
                                {!isSubscribed && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                                      <Lock className="h-6 w-6 text-neutral-500" />
                                    </div>
                                  </div>
                                )}
                                
                                {isSubscribed && (
                                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                                      <Download className="h-7 w-7" style={{ color }} />
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <CardContent className="p-3">
                                <h4 className="text-sm font-medium text-neutral-900 truncate">{page.title}</h4>
                                {isSubscribed && (
                                  <Button 
                                    className="w-full mt-2 text-white rounded-xl text-xs h-8"
                                    style={{ backgroundColor: color }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownload(page.imageUrl, page.title);
                                    }}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                )}
                              </CardContent>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Divider between folders */}
                    <div className="border-b border-neutral-200 mt-6" />
                  </div>
                ))}
              </div>
            )}
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
