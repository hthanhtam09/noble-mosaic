import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Eye, EyeOff, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SecretImageViewerModalProps {
  onClose: () => void;
  colorImageUrl: string;
  uncolorImageUrl: string;
  title: string;
  number?: number;
}

export default function SecretImageViewerModal({
  onClose,
  colorImageUrl,
  uncolorImageUrl,
  title,
  number,
}: SecretImageViewerModalProps) {
  const [viewMode, setViewMode] = useState<'uncolor' | 'color'>('uncolor');

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const toggleColor = () => {
    setViewMode(prev => prev === 'color' ? 'uncolor' : 'color');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 backdrop-blur-md"
    >
      {/* Top Controls */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[110] flex items-center gap-3"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={toggleColor}
          className={cn(
            "hidden sm:flex bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-full items-center gap-2 h-11 px-5 transition-all duration-300 group backdrop-blur-md",
            viewMode === 'color' && "bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/90 border-[var(--mosaic-teal)] shadow-lg shadow-black/20"
          )}
        >
          {viewMode === 'color' ? (
            <>
              <Eye className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wide">Showing Colors</span>
            </>
          ) : (
            <>
              <EyeOff className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wide">Hidden Image</span>
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-full h-11 w-11 transition-all backdrop-blur-md"
        >
          <X className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Secret Number Badge - Top Left */}
      {number !== undefined && (
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 left-4 sm:top-8 sm:left-8 z-[110]"
        >
          <div className="flex flex-col">
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 shadow-2xl transition-all duration-500 hover:bg-black/60">
              <span className="text-orange-400 text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">Secret Archive</span>
              <div className="flex items-center gap-3">
                <span className="text-white text-4xl font-serif font-bold italic leading-none">{number}</span>
                <div className="h-8 w-[1px] bg-white/20" />
                <span className="text-white/60 text-[10px] uppercase tracking-widest leading-tight w-20">Unique Hidden Masterpiece</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile Toggle Bar - Bottom */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="sm:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] w-full px-6 flex justify-center"
      >
        <Button
          variant="default"
          onClick={toggleColor}
          className={cn(
            "rounded-2xl h-14 px-8 shadow-2xl transition-all duration-500 flex items-center gap-3 w-full max-w-[280px] backdrop-blur-md text-white font-bold uppercase tracking-widest text-sm",
            viewMode === 'color' 
              ? "bg-[var(--mosaic-teal)] shadow-[var(--mosaic-teal)]/20" 
              : "bg-white/20 border border-white/20 hover:bg-white/30"
          )}
        >
          {viewMode === 'color' ? (
            <>
              <Eye className="h-5 w-5" />
              <span>Showing Colors</span>
            </>
          ) : (
            <>
              <EyeOff className="h-5 w-5" />
              <span>Hidden Image</span>
            </>
          )}
        </Button>
      </motion.div>

      {/* Image Container */}
      <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center py-16 sm:py-0">
        <motion.div 
          layout
          className="relative w-full aspect-[3/4] max-h-[75vh] group"
        >
          {/* Glass Effect Shadow */}
          <div className="absolute -inset-4 bg-[var(--mosaic-teal)]/5 blur-3xl rounded-full opacity-50 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {viewMode === 'uncolor' ? (
              <motion.div
                key="uncolor"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={uncolorImageUrl}
                  alt={`${title} - Uncolored`}
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  sizes="100vw"
                  quality={100}
                  priority
                  unoptimized={true}
                />
              </motion.div>
            ) : (
              <motion.div
                key="color"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={colorImageUrl}
                  alt={`${title} - Colored`}
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  sizes="100vw"
                  quality={100}
                  priority
                  unoptimized={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info Label - Hidden on Mobile */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] text-center hidden sm:block"
        >
          <p className="text-white/60 text-xs uppercase tracking-[0.3em] font-medium mb-1">Revealing Archive</p>
          <p className="text-white text-lg font-serif font-medium">{title.split(' - ')[0]}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}


