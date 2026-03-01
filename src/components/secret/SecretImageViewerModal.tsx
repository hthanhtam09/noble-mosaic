'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Eye, EyeOff, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SecretImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorImageUrl: string;
  uncolorImageUrl: string;
  originalImageUrl?: string;
  title: string;
}

export default function SecretImageViewerModal({
  isOpen,
  onClose,
  colorImageUrl,
  uncolorImageUrl,
  originalImageUrl,
  title,
}: SecretImageViewerModalProps) {
  const [viewMode, setViewMode] = useState<'uncolor' | 'color' | 'original'>('uncolor');

  if (!isOpen) return null;

  const toggleColor = () => {
    setViewMode(prev => prev === 'color' ? 'uncolor' : 'color');
  };

  const toggleOriginal = () => {
    setViewMode(prev => prev === 'original' ? 'uncolor' : 'original');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[110] flex items-center gap-4">
        {originalImageUrl && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleOriginal}
            className={cn(
              "bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-full hidden sm:flex h-12 w-12 transition-all group",
              viewMode === 'original' && "bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/80 border-[var(--mosaic-teal)]"
            )}
            title={viewMode === 'original' ? "Hide Original" : "Show Original"}
          >
            <ImageIcon className="h-6 w-6" />
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleColor}
          className={cn(
            "bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-full hidden sm:flex h-12 w-12 transition-all group",
            viewMode === 'color' && "bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/80 border-[var(--mosaic-teal)]"
          )}
          title={viewMode === 'color' ? "Hide Color" : "Show Color"}
        >
          {viewMode === 'color' ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-full h-12 w-12 transition-all"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Controls (floating bottom right on small screens) */}
      <div className="sm:hidden fixed bottom-6 right-6 z-[110] flex flex-col gap-3">
        {originalImageUrl && (
          <Button
            variant="default"
            size="icon"
            onClick={toggleOriginal}
            className={cn(
              "rounded-full h-14 w-14 shadow-2xl transition-all",
              viewMode === 'original' ? "bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/90" : "bg-neutral-800 hover:bg-neutral-700 text-white"
            )}
          >
            <ImageIcon className="h-6 w-6 text-white" />
          </Button>
        )}
        <Button
          variant="default"
          size="icon"
          onClick={toggleColor}
          className={cn(
            "rounded-full h-14 w-14 shadow-2xl transition-all",
            viewMode === 'color' ? "bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/90" : "bg-neutral-800 hover:bg-neutral-700 text-white"
          )}
        >
          {viewMode === 'color' ? <Eye className="h-6 w-6 text-white" /> : <EyeOff className="h-6 w-6 text-white" />}
        </Button>
      </div>

      {/* Image Container */}
      <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center">
        {/* Uncolor Image */}
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            viewMode === 'uncolor' ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <Image
            src={uncolorImageUrl}
            alt={`${title} - Uncolored`}
            fill
            className="object-contain"
            sizes="100vw"
            quality={100}
            priority
            unoptimized={true}
          />
        </div>

        {/* Color Image */}
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            viewMode === 'color' ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <Image
            src={colorImageUrl}
            alt={`${title} - Colored`}
            fill
            className="object-contain"
            sizes="100vw"
            quality={100}
            priority
            unoptimized={true}
          />
        </div>

        {/* Original Image */}
        {originalImageUrl && (
          <div 
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              viewMode === 'original' ? "opacity-100 visible" : "opacity-0 invisible"
            )}
          >
            <Image
              src={originalImageUrl}
              alt={`${title} - Original`}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
              priority
              unoptimized={true}
            />
          </div>
        )}
      </div>
      
      {/* Footer Text */}
      <div className="absolute bottom-6 left-6 z-[110] text-white/50 text-sm hidden sm:block">
        <p>{title}</p>
        <p className="mt-1 flex items-center gap-2">
          Use the <EyeOff className="h-4 w-4 inline" /> toggle to reveal the colors!
        </p>
      </div>
    </div>
  );
}
