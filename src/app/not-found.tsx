import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Mosaic Hero Background Pattern */}
            <div className="absolute inset-0 mosaic-hero opacity-30 pointer-events-none" />

            {/* Decorative Circles */}
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[var(--mosaic-coral)] rounded-full blur-[100px] opacity-10 animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[var(--mosaic-teal)] rounded-full blur-[100px] opacity-10 animate-pulse" />

            <div className="relative z-10 max-w-2xl w-full text-center space-y-8 glass p-12 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl">
                <div className="space-y-2">
                    <h1 className="text-8xl md:text-9xl font-serif font-bold text-neutral-900 drop-shadow-sm select-none">
                        404
                    </h1>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-[var(--mosaic-coral)] via-[var(--mosaic-gold)] to-[var(--mosaic-teal)] mx-auto rounded-full" />
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-neutral-800">
                        Oops! This piece seems to be missing.
                    </h2>
                    <p className="text-neutral-500 text-lg leading-relaxed max-w-md mx-auto">
                        The page you're looking for has wandered off into another puzzle. Don't worry, we'll help you find your way back.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/"
                        className="btn-mosaic flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all w-full sm:w-auto justify-center"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <Link
                        href="/products"
                        className="flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 border border-neutral-200 rounded-xl font-semibold shadow-sm hover:bg-neutral-50 hover:scale-105 transition-all w-full sm:w-auto justify-center"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Explore Books
                    </Link>
                </div>

                {/* Mosaic Dots Decoration */}
                <div className="flex justify-center gap-3 pt-8">
                    {['coral', 'teal', 'purple', 'gold', 'sage'].map((color) => (
                        <div
                            key={color}
                            className="w-3 h-3 rounded-full shadow-inner animate-bounce"
                            style={{
                                backgroundColor: `var(--mosaic-${color})`,
                                animationDelay: `${['coral', 'teal', 'purple', 'gold', 'sage'].indexOf(color) * 0.1}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
