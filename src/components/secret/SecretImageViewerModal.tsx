'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SecretImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorImageUrl: string;
  uncolorImageUrl: string;
  title: string;
}

export default function SecretImageViewerModal({
  isOpen,
  onClose,
  colorImageUrl,
  uncolorImageUrl,
  title,
}: SecretImageViewerModalProps) {
  const [showColor, setShowColor] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[110] flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowColor(!showColor)}
          className={cn(
            "bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-full hidden sm:flex h-12 w-12 transition-all group",
            showColor && "bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/80 border-[var(--mosaic-teal)]"
          )}
          title={showColor ? "Hide Color" : "Show Color"}
        >
          {showColor ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
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

      {/* Mobile Eye Toggle (floating bottom right on small screens) */}
      <Button
        variant="default"
        size="icon"
        onClick={() => setShowColor(!showColor)}
        className={cn(
          "sm:hidden fixed bottom-6 right-6 z-[110] rounded-full h-14 w-14 shadow-2xl transition-all",
          showColor ? "bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/90" : "bg-neutral-800 hover:bg-neutral-700 text-white"
        )}
      >
        {showColor ? <Eye className="h-6 w-6 text-white" /> : <EyeOff className="h-6 w-6" />}
      </Button>

      {/* Image Container */}
      <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center">
        {/* Uncolor Image (Always present underneath, or hidden if color is shown to free up DOM, but actually placing them on top of each other allows for cross-fade) */}
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            showColor ? "opacity-0 invisible" : "opacity-100 visible"
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
            showColor ? "opacity-100 visible" : "opacity-0 invisible"
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
