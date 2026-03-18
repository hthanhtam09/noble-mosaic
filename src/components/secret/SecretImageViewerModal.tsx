import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface SecretImageViewerModalProps {
  onClose: () => void;
  colorImageUrl: string;
  uncolorImageUrl: string;
  title: string;
  number?: number;
  answer?: string;
}

export default function SecretImageViewerModal({
  onClose,
  colorImageUrl,
  uncolorImageUrl,
  title,
  number,
  answer,
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
      {/* Unified Top Header Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 z-[110] flex items-center justify-between pointer-events-none"
      >
        {/* LEFT: Archive + Mobile Answer */}
        <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto min-w-0 mr-4">
          {number !== undefined && (
            <div className="flex-none bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-2.5 shadow-2xl transition-all duration-500 hover:bg-black/60 flex flex-col justify-center">
              <span className="text-orange-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-0.5 block text-center sm:text-left">Archive</span>
              <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-3">
                <span className="text-white text-lg sm:text-2xl font-serif font-bold italic leading-none">{number}</span>
                <div className="h-4 sm:h-6 w-[1px] bg-white/20 hidden sm:block" />
                <span className="text-white/60 text-[8px] sm:text-[10px] uppercase tracking-widest leading-tight w-16 sm:w-20 hidden sm:block">Unique Masterpiece</span>
              </div>
            </div>
          )}

          {/* Answer Box (Mobile Only) */}
          {answer && (
            <div className="flex-1 lg:hidden bg-gradient-to-r from-orange-500/90 to-amber-500/90 backdrop-blur-xl border border-white/40 rounded-xl px-4 py-2 shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center justify-center min-w-0 min-h-[44px] text-center">
              <span className="text-white text-sm sm:text-base font-bold tracking-wide drop-shadow-md uppercase whitespace-normal break-words leading-tight">{answer}</span>
            </div>
          )}
        </div>

        {/* CENTER: Answer Box (Tablet & PC) */}
        {answer && (
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 hidden lg:flex pointer-events-auto max-w-[40%] w-full justify-center">
            <div className="bg-gradient-to-r from-orange-500/90 to-amber-500/90 backdrop-blur-xl border border-white/40 rounded-2xl px-6 py-2.5 shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center justify-center text-center">
              <span className="text-white text-xl font-bold tracking-wide drop-shadow-md uppercase whitespace-normal break-words leading-tight">{answer}</span>
            </div>
          </div>
        )}

        {/* RIGHT: Top Controls */}
        <div className="flex items-center gap-3 pointer-events-auto flex-none">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleColor}
            className={cn(
              "hidden lg:flex bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-full items-center gap-2 h-11 px-5 transition-all duration-300 group backdrop-blur-md",
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
        </div>
      </motion.div>

      {/* Mobile Toggle Bar - Bottom */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] w-full px-6 flex justify-center"
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
      <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center pt-32 pb-24 lg:pt-24 lg:pb-8 flex-1 overflow-hidden z-[100]">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={8}
          centerOnInit={true}
          wheel={{ wheelDisabled: false }}
          pinch={{ disabled: false }}
          doubleClick={{ disabled: false }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Zoom Controls */}
              <div className="absolute right-4 sm:right-8 bottom-32 lg:bottom-12 z-[120] flex flex-col gap-2 pointer-events-auto">
                <Button variant="outline" size="icon" onClick={() => zoomIn()} className="bg-black/50 hover:bg-black/70 border-white/20 text-white rounded-full backdrop-blur-md shadow-xl h-10 w-10 sm:h-12 sm:w-12 transition-all">
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => zoomOut()} className="bg-black/50 hover:bg-black/70 border-white/20 text-white rounded-full backdrop-blur-md shadow-xl h-10 w-10 sm:h-12 sm:w-12 transition-all">
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => resetTransform()} className="bg-black/50 hover:bg-black/70 border-white/20 text-white rounded-full backdrop-blur-md shadow-xl h-10 w-10 sm:h-12 sm:w-12 transition-all">
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>

              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                <motion.div 
                  layout
                  className="relative w-full h-full flex items-center justify-center group"
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
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={uncolorImageUrl}
                          alt={`${title} - Uncolored`}
                          className="max-w-full max-h-[70vh] sm:max-h-[70vh] lg:max-h-[85vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="color"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={colorImageUrl}
                          alt={`${title} - Colored`}
                          className="max-w-full max-h-[70vh] sm:max-h-[70vh] lg:max-h-[85vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </motion.div>
  );
}


