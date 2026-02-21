'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft, Image as ImageIcon, LockOpen } from 'lucide-react';
import SecretImageViewerModal from '@/components/secret/SecretImageViewerModal';

interface SecretImage {
  _id: string;
  colorImageUrl: string;
  uncolorImageUrl: string;
  order: number;
}

interface SecretBookInfo {
  title: string;
  slug: string;
  coverImage: string;
}

function SecretBookContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [book, setBook] = useState<SecretBookInfo | null>(null);
  const [secrets, setSecrets] = useState<SecretImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedSecret, setSelectedSecret] = useState<SecretImage | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchSecrets = async () => {
      try {
        const res = await fetch(`/api/secrets/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data.product);
          setSecrets(data.secrets || []);
        } else {
          router.push('/secret');
        }
      } catch (error) {
        console.error('Error fetching secret details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecrets();
  }, [slug, router]);

  // Synchronize modal state with URL `?num=` parameter
  useEffect(() => {
    if (secrets.length === 0) return;
    const numParam = searchParams.get('num');
    if (numParam) {
      const targetSecret = secrets.find(s => s.order.toString() === numParam);
      if (targetSecret && selectedSecret?._id !== targetSecret._id) {
        setSelectedSecret(targetSecret);
      }
    } else if (selectedSecret) {
       setSelectedSecret(null);
    }
  }, [secrets, searchParams, selectedSecret]);

  const handleOpenSecret = (secret: SecretImage) => {
    setSelectedSecret(secret);
    router.push(`/secret/${slug}?num=${secret.order}`, { scroll: false });
  };

  const handleCloseModal = () => {
    setSelectedSecret(null);
    router.push(`/secret/${slug}`, { scroll: false });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-grow pb-24">
        {/* Header Section */}
        <section className="bg-white border-b border-neutral-200 py-10 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/secret')}
              className="mb-8 hover:bg-neutral-100 text-neutral-600 rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Secrets
            </Button>
            
            {isLoading ? (
              <div className="flex animate-pulse gap-6">
                <div className="w-24 h-32 bg-neutral-200 rounded-md"></div>
                <div className="flex-1 pt-2">
                  <div className="h-8 bg-neutral-200 w-1/3 rounded mb-4"></div>
                  <div className="h-4 bg-neutral-200 w-1/2 rounded"></div>
                </div>
              </div>
            ) : book ? (
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
                <div className="relative w-32 md:w-40 aspect-[3/4] rounded-lg overflow-hidden shadow-lg border border-neutral-100 flex-none bg-white">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <LockOpen className="absolute bottom-3 right-3 text-white h-5 w-5 drop-shadow-md" />
                </div>
                <div className="text-center md:text-left pt-2 md:pt-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-3 md:mb-4">
                    {book.title}
                  </h1>
                  <p className="text-lg text-neutral-600 max-w-2xl">
                    Tap any image below to reveal its secret colors. Experience the magic of turning a simple outline into a beautiful mosaic masterpiece.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--mosaic-teal)]" />
              </div>
            ) : secrets.length === 0 ? (
              <div className="text-center py-20">
                <ImageIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-neutral-900 mb-2">No Secrets Yet</h3>
                <p className="text-neutral-500">More secrets will be revealed soon for this collection!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {secrets.map((secret, index) => (
                  <Card 
                    key={secret._id}
                    className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group rounded-xl overflow-hidden bg-white"
                    onClick={() => handleOpenSecret(secret)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                      {/* Show colored as the default view before they click */}
                      <Image
                        src={secret.colorImageUrl}
                        alt={`Secret Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        unoptimized={true}
                      />
                      
                      <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-300 flex items-center justify-center">
                        <Button 
                          variant="secondary" 
                          className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 hover:bg-white text-neutral-900 rounded-full font-medium"
                        >
                          View Secret
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Modal */}
      {selectedSecret && book && (
        <SecretImageViewerModal
          isOpen={!!selectedSecret}
          onClose={handleCloseModal}
          colorImageUrl={selectedSecret.colorImageUrl}
          uncolorImageUrl={selectedSecret.uncolorImageUrl}
          title={`${book.title} - Secret #${selectedSecret.order || 1}`}
        />
      )}
    </div>
  );
}

export default function SecretBookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-neutral-400" /></div>}>
      <SecretBookContent />
    </Suspense>
  );
}
