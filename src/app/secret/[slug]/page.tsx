'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSecretBookDetails } from '@/hooks/api/useSecrets';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Image as ImageIcon, LockOpen, Lock, KeyRound } from 'lucide-react';
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
  amazonUrlStandard?: string;
  amazonUrlPremium?: string;
  previewImage?: string;
}

function SecretBookContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [storedKey, setStoredKey] = useState<string | null>(null);

  // Only read localStorage on the client side
  useEffect(() => {
    setStoredKey(localStorage.getItem(`secret_key_${slug}`));
  }, [slug]);

  const { data, isLoading, refetch } = useSecretBookDetails(slug, storedKey);

  const [inputKey, setInputKey] = useState('');
  const [isCheckingKey, setIsCheckingKey] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [selectedSecret, setSelectedSecret] = useState<SecretImage | null>(null);

  const isLocked = !data?.secrets || data.secrets.length === 0;
  const book = ((data?.product || data?.book) as SecretBookInfo) || null;
  const secrets = data?.secrets || [];

  useEffect(() => {
    // Basic catch if no data returns from hook
    if (!isLoading && !data?.product && !data?.book) {
      router.push('/secret');
    }
  }, [data, isLoading, router]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey || inputKey.length !== 6) {
      setKeyError('Key must be exactly 6 characters');
      return;
    }

    setIsCheckingKey(true);
    setKeyError('');

    try {
      const res = await fetch(`/api/secrets/${slug}?key=${encodeURIComponent(inputKey.toUpperCase())}`);
      if (res.status === 403) {
        setKeyError('Incorrect Secret Key');
      } else if (res.ok) {
        localStorage.setItem(`secret_key_${slug}`, inputKey.toUpperCase());
        setStoredKey(inputKey.toUpperCase());
      } else {
        setKeyError('An error occurred. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setKeyError('Connection error');
    } finally {
      setIsCheckingKey(false);
    }
  };

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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pb-24">
        {/* Header Section */}
        <section className="bg-white border-b border-neutral-200 py-10 shadow-sm">
          <div className="layout-inner">
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

        {/* Conditional View: Lock Screen OR Gallery */}
        {isLocked ? (
          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-lg px-4 sm:px-6">
              <Card className="p-8 md:p-10 border-0 shadow-xl rounded-2xl bg-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--mosaic-teal)]" />

                {book && (book.previewImage || book.coverImage) ? (
                  <div className="w-24 h-24 mx-auto mb-6 relative rounded-lg overflow-hidden shadow-sm border border-neutral-100">
                    <Image
                      src={book.previewImage || book.coverImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
                      <Lock className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="h-8 w-8 text-neutral-600" />
                  </div>
                )}

                <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">Secret Key Required</h3>
                <p className="text-neutral-500 px-4">
                  This book is locked. Please enter the 6-character secret key to view the hidden images.
                </p>
                <p className="text-neutral-500 mb-8 px-4 font-bold text-xl">
                  Get the secret key on page 106
                </p>
                <form onSubmit={handleUnlock} className="space-y-4 mb-8">
                  <div className="relative max-w-[280px] mx-auto">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      type="text"
                      placeholder="ENTER KEY"
                      value={inputKey}
                      onChange={(e) => {
                        setInputKey(e.target.value.toUpperCase().slice(0, 6));
                        setKeyError('');
                      }}
                      className="pl-12 py-6 text-center text-xl tracking-[0.2em] font-mono font-bold uppercase ring-offset-white border-2 border-neutral-200 focus-visible:border-[var(--mosaic-teal)] focus-visible:ring-0 bg-neutral-50"
                      disabled={isCheckingKey}
                    />
                  </div>

                  {keyError && (
                    <div className="text-red-500 text-sm font-medium animate-in slide-in-from-top-1">
                      {keyError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full max-w-[280px] py-6 text-base rounded-full bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/90 text-white shadow-md hover:shadow-lg transition-all"
                    disabled={isCheckingKey || inputKey.length !== 6}
                  >
                    {isCheckingKey ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    {isCheckingKey ? 'Verifying...' : 'Unlock Secrets'}
                  </Button>
                </form>

                {(book?.amazonUrlStandard || book?.amazonUrlPremium) && (
                  <div className="pt-6 border-t border-neutral-100">
                    <p className="text-sm font-medium text-neutral-900 mb-3">Don't have the key yet?</p>
                    <div className="flex flex-col gap-3 items-center">
                      {book.amazonUrlStandard && (
                        <a
                          href={book.amazonUrlStandard}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full max-w-[280px] py-3 px-6 text-sm font-bold rounded-full bg-[#FF9900] hover:bg-[#FF9900]/90 text-neutral-900 shadow-sm transition-all shadow-[#FF9900]/20 hover:shadow-[#FF9900]/40"
                        >
                          Buy Standard Edition
                        </a>
                      )}
                      {book.amazonUrlPremium && (
                        <a
                          href={book.amazonUrlPremium}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full max-w-[280px] py-3 px-6 text-sm font-bold rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm transition-all shadow-neutral-900/20 hover:shadow-neutral-900/40"
                        >
                          Buy Premium Edition
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </section>
        ) : (
          <section className="py-12 md:py-16">
            <div className="layout-inner">
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
        )}
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
