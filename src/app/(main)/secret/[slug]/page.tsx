'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSecretBookDetails } from '@/hooks/api/useSecrets';
import { api } from '@/lib/api';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Image as ImageIcon, LockOpen, Lock, KeyRound, ArrowRight, X } from 'lucide-react';
import SecretImageViewerModal from '@/components/secret/SecretImageViewerModal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SecretImage {
  _id: string;
  colorImageUrl: string;
  uncolorImageUrl: string;
  order: number;
  answer?: string;
}

interface SecretBookInfo {
  title: string;
  slug: string;
  coverImage: string;
  amazonUrlStandard?: string;
  amazonUrlPremium?: string;
  previewImage?: string;
  secretPageNumber?: number;
}

function SecretBookContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);

  // Only read localStorage on the client side
  useEffect(() => {
    setStoredKey(localStorage.getItem(`secret_key_${slug}`));
    setIsCheckingStorage(false);
  }, [slug]);

  const { data, isLoading } = useSecretBookDetails(slug, storedKey);

  const [inputKey, setInputKey] = useState('');
  const [isCheckingKey, setIsCheckingKey] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [selectedSecret, setSelectedSecret] = useState<SecretImage | null>(null);

  const isPageLoading = isLoading || isCheckingStorage;

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
      // We still need to verify the key first, but we'll use the API client
      const res = await api.get<any, any>(`/secrets/${slug}?key=${encodeURIComponent(inputKey.toUpperCase())}`);

      // If we get here, it means the key is valid (api doesn't throw for 200s)
      localStorage.setItem(`secret_key_${slug}`, inputKey.toUpperCase());
      setStoredKey(inputKey.toUpperCase());
    } catch (err: any) {
      if (err.response?.status === 403) {
        setKeyError('Incorrect Secret Key');
      } else {
        console.error(err);
        setKeyError('An error occurred. Please try again.');
      }
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
    // Only trigger navigation, let useEffect handle closing for smoothness
    router.push(`/secret/${slug}`, { scroll: false });
  };

  return (
    <>
      <div className="flex-grow pb-24">
        {/* Header Section */}
        <section className="bg-white border-b border-neutral-200 py-10 shadow-sm">
          <div className="layout-inner">
          

            {isPageLoading ? (
                 null
            ) : book ? (
            <div className="relative flex items-center justify-center">
                <div className="absolute left-0 hidden md:block">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/secret')}
                    className="hover:bg-neutral-100 text-neutral-600 rounded-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Secrets
                  </Button>
                </div>
                <div className="absolute left-0 md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/secret')}
                    className="hover:bg-neutral-100 text-neutral-600 rounded-full"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>
                <div className="text-center pt-2 md:pt-4 px-12 md:px-32 max-w-4xl mx-auto">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-3 md:mb-4">
                    {book.title}
                  </h1>
                </div>
            </div>
            ) : null}
          </div>
        </section>

        {/* Conditional View: Lock Screen OR Gallery */}
        {isPageLoading ? (
          <section className="py-16 md:py-24">
            <div className="layout-inner">
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <Loader2 className="h-10 w-10 animate-spin text-[var(--mosaic-teal)] mb-6" />
                <h3 className="text-xl font-serif font-medium text-neutral-900 mb-2">Unlocking Secrets...</h3>
                <p className="text-neutral-500 text-center max-w-sm">Please wait while we prepare the hidden images for you.</p>
              </div>
            </div>
          </section>
        ) : isLocked ? (
          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-lg px-4 sm:px-6">
                <motion.div
                  animate={keyError ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="p-8 md:p-10 border-0 shadow-xl rounded-3xl bg-white text-center relative overflow-hidden ring-1 ring-neutral-100">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-[var(--mosaic-teal)] to-[var(--mosaic-purple)]" />
                    <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-3 tracking-tight">Secret Key Required</h3>
                    <p className="text-neutral-500 px-4 mb-8 leading-relaxed">
                      This book is locked. Please enter the 6-character secret key to view the hidden images.
                    </p>

                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8 mx-auto max-w-[320px] shadow-sm flex flex-col items-center justify-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full">Where is the key?</span>
                      <span className="text-sm font-semibold text-orange-900">Look at the bottom of <strong>page {book?.secretPageNumber || 86}</strong></span>
                    </div>

                    <form onSubmit={handleUnlock} className="flex flex-col items-center mb-8 w-full max-w-[320px] mx-auto">
                      <div className="relative w-full mb-4">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <Input
                          type="text"
                          placeholder="XXXXXX"
                          maxLength={6}
                          value={inputKey}
                          onChange={(e) => {
                            setInputKey(e.target.value.toUpperCase().slice(0, 6));
                            setKeyError('');
                          }}
                          className={cn(
                            "pl-12 py-7 text-center text-3xl tracking-[0.3em] font-mono font-bold uppercase border-2 rounded-2xl transition-all w-full",
                            keyError ? "border-red-300 bg-red-50/30" : "border-neutral-200 bg-neutral-50/50 focus-visible:border-[var(--mosaic-teal)] focus-visible:ring-0"
                          )}
                          disabled={isCheckingKey}
                        />
                      </div>

                      <AnimatePresence>
                        {keyError && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-600 text-sm font-bold mb-6 flex items-center justify-center bg-red-50 py-3 w-full rounded-2xl border border-red-100 shadow-sm"
                          >
                            <X className="h-4 w-4 mr-2" />
                            {keyError}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button
                        type="submit"
                        className="w-full h-15 text-lg font-bold rounded-2xl bg-neutral-900 hover:bg-black text-white shadow-xl shadow-neutral-200 hover:shadow-neutral-300 transition-all hover:scale-[1.02] active:scale-98"
                        disabled={isCheckingKey || inputKey.length !== 6}
                      >
                        {isCheckingKey ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <LockOpen className="h-5 w-5 mr-2" />}
                        {isCheckingKey ? 'Verifying...' : 'Unlock Secrets'}
                      </Button>
                    </form>

                    {book?.slug && (
                      <div className="pt-10 border-t border-neutral-100 w-full mt-2">
                        <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-6">Want to unlock all secret images?</p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <Link
                              href={`/books/${book.slug}`}
                              title={`Get the full ${book.title} coloring book version`}
                              className="inline-flex items-center justify-center w-full sm:w-auto py-3 px-8 text-base font-bold rounded-2xl bg-white border-2 border-orange-400/30 hover:border-orange-500 text-neutral-800 hover:text-orange-600 transition-all hover:bg-orange-50 group shadow-sm hover:shadow-md"
                            >
                              <span className="flex items-center gap-2">
                                Get the Full Coloring Book <ArrowRight className="w-4 h-4 text-orange-400 group-hover:text-orange-600 transition-colors" />
                              </span>
                            </Link>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
            </div>
          </section>
        ) : (
          <section className="py-12 md:py-16">
            <div className="layout-inner">
              {secrets.length === 0 ? (
                <div className="text-center py-20">
                  <ImageIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-neutral-900 mb-2">No Secrets Yet</h3>
                  <p className="text-neutral-500">More secrets will be revealed soon for this collection!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 [content-visibility:auto]">
                  {secrets.map((secret, index) => (
                    <Card
                      key={secret._id}
                      className="border-0 shadow-sm hover:shadow-xl transition-[box-shadow,transform] duration-300 cursor-pointer group rounded-xl overflow-hidden bg-white transform-gpu hover:-translate-y-1"
                      onClick={() => handleOpenSecret(secret)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                        <Image
                          src={secret.colorImageUrl}
                          alt={`Secret Image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                          <div
                            className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-md px-4 py-2 text-neutral-900 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg"
                          >
                            View Secret
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
      <AnimatePresence>
        {selectedSecret && book && (
          <SecretImageViewerModal
            onClose={handleCloseModal}
            colorImageUrl={selectedSecret.colorImageUrl}
            uncolorImageUrl={selectedSecret.uncolorImageUrl}
            title={`${book.title} - Secret #${selectedSecret.order || 1}`}
            number={selectedSecret.order}
            answer={selectedSecret.answer}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function SecretBookPage() {
  return (
    <Suspense fallback={<div className="bg-neutral-50 flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-neutral-400" /></div>}>
      <SecretBookContent />
    </Suspense>
  );
}
