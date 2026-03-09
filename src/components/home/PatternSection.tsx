"use client";

import React from "react";

const patterns = [
    {
        id: "square",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Inner Grid with rounded corners */}
                <rect x="15" y="15" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />
                <rect x="38.33" y="15" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />
                <rect x="61.66" y="15" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />

                <rect x="15" y="38.33" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />
                <rect x="38.33" y="38.33" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />
                <rect x="61.66" y="38.33" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />

                <rect x="15" y="61.66" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />
                <rect x="38.33" y="61.66" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />
                <rect x="61.66" y="61.66" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />


                {/* Outline */}
                <rect x="15" y="15" width="70" height="70" stroke="currentColor" strokeWidth="4" />
            </svg>
        ),
    },
    {
        id: "dot",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <clipPath id="dot-clip-2">
                        <circle cx="50" cy="50" r="38" />
                    </clipPath>
                </defs>
                <g clipPath="url(#dot-clip-2)">
                    {/* Circles */}
                    <circle cx="32" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    <circle cx="68" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    <circle cx="14" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    <circle cx="86" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    <circle cx="32" cy="76" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    <circle cx="68" cy="76" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </g>
                {/* Outline */}
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" />
            </svg>
        ),
    },
    {
        id: "diamond",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <clipPath id="diamond-clip-2">
                        <polygon points="50,12 88,50 50,88 12,50" />
                    </clipPath>
                    <pattern id="diamond-grid" width="28.28" height="28.28" patternUnits="userSpaceOnUse" patternTransform="rotate(45) translate(3, 3)">
                        <rect x="0" y="0" width="28.28" height="28.28" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="0" cy="0" r="2" fill="currentColor" />
                        <circle cx="28.28" cy="0" r="2" fill="currentColor" />
                        <circle cx="0" cy="28.28" r="2" fill="currentColor" />
                        <circle cx="28.28" cy="28.28" r="2" fill="currentColor" />
                    </pattern>
                </defs>
                {/* Grid Background */}
                <polygon points="50,12 88,50 50,88 12,50" fill="url(#diamond-grid)" />

                {/* Texts */}


                {/* Outline */}
                <polygon points="50,10 90,50 50,90 10,50" stroke="currentColor" strokeLinejoin="round" strokeWidth="4" />
            </svg>
        ),
    },
    {
        id: "hexagon",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <clipPath id="hex-clip-2">
                        <polygon points="50,12 82.64,31 82.64,69 50,88 17.36,69 17.36,31" />
                    </clipPath>
                </defs>
                <g clipPath="url(#hex-clip-2)">
                    {/* Center Hexagon */}
                    <polygon points="50,38 64,46 64,62 50,70 36,62 36,46" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    {/* Top Left */}
                    <polygon points="36,14 50,22 50,38 36,46 22,38 22,22" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    {/* Top Right */}
                    <polygon points="64,14 78,22 78,38 64,46 50,38 50,22" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    {/* Bottom Left */}
                    <polygon points="36,62 50,70 50,86 36,94 22,86 22,70" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    {/* Bottom Right */}
                    <polygon points="64,62 78,70 78,86 64,94 50,86 50,70" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    {/* Far Left Mid */}
                    <polygon points="22,38 36,46 36,62 22,70 8,62 8,46" fill="none" stroke="currentColor" strokeWidth="1.5" />

                    {/* Far Right Mid */}
                    <polygon points="78,38 92,46 92,62 78,70 64,62 64,46" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </g>
                {/* Outline */}
                <polygon points="50,10 84.64,30 84.64,70 50,90 15.36,70 15.36,30" stroke="currentColor" strokeLinejoin="round" strokeWidth="4" />
            </svg>
        ),
    },
    {
        id: "puzzle",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Puzzle Inner Lines */}
                {/* Vertical 1 */}
                <path d="M 38.33 15 L 38.33 26 A 4 4 0 1 1 38.33 34 L 38.33 51 A 4 4 0 1 0 38.33 59 L 38.33 85" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Vertical 2 */}
                <path d="M 61.66 15 L 61.66 28 A 4 4 0 1 0 61.66 36 L 61.66 54 A 4 4 0 1 1 61.66 62 L 61.66 85" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Horizontal 1 */}
                <path d="M 15 38.33 L 26 38.33 A 4 4 0 1 0 34 38.33 L 47 38.33 A 4 4 0 1 1 55 38.33 L 85 38.33" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Horizontal 2 */}
                <path d="M 15 61.66 L 31 61.66 A 4 4 0 1 1 39 61.66 L 51 61.66 A 4 4 0 1 0 59 61.66 L 85 61.66" fill="none" stroke="currentColor" strokeWidth="1.5" />


                {/* Outline */}
                <rect x="15" y="15" width="70" height="70" stroke="currentColor" strokeWidth="4" />
            </svg>
        ),
    },
    {
        id: "islamic",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    {/* Inner 8-point Star grid */}
                    <pattern id="islamic-grid" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="translate(5, 5)">
                        <path d="M 0 15 L 6.2 6.2 L 15 0 L 23.8 6.2 L 30 15 L 23.8 23.8 L 15 30 L 6.2 23.8 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M 15 0 L 15 30 M 0 15 L 30 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </pattern>
                    <clipPath id="islamic-clip-2">
                        <polygon points="50,10 61.31,28.69 80,20 71.31,38.69 90,50 71.31,61.31 80,80 61.31,71.31 50,90 38.69,71.31 20,80 28.69,61.31 10,50 28.69,38.69 20,20 38.69,28.69" />
                    </clipPath>
                </defs>

                {/* Content */}
                <g clipPath="url(#islamic-clip-2)">
                    {/* Center Cross/Star */}
                    <path d="M 50 20 L 59 38 L 80 41 L 62 50 L 80 59 L 59 62 L 50 80 L 41 62 L 20 59 L 38 50 L 20 41 L 41 38 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" strokeLinejoin="round" />
                    {/* Vertical & Horizontal Lines */}
                    <path d="M 50 10 L 50 20 M 50 80 L 50 90 M 10 50 L 20 50 M 80 50 L 90 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />
                    {/* Diagonal Lines */}
                    <path d="M 28 28 L 38 38 M 72 28 L 62 38 M 28 72 L 38 62 M 72 72 L 62 62" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" />
                </g>

                {/* Outline */}
                <polygon points="50,10 61.31,28.69 80,20 71.31,38.69 90,50 71.31,61.31 80,80 61.31,71.31 50,90 38.69,71.31 20,80 28.69,61.31 10,50 28.69,38.69 20,20 38.69,28.69" stroke="currentColor" strokeLinejoin="round" strokeWidth="4" />
            </svg>
        ),
    },
    {
        id: "fish-scale",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <pattern id="scale-grid" width="28" height="14" patternUnits="userSpaceOnUse" patternTransform="translate(0, 1) scale(1.1)">
                        {/* Top Row Scales */}
                        <path d="M 0 14 A 14 14 0 0 1 28 14" fill="none" stroke="currentColor" strokeWidth="1.3" />
                        {/* Bottom Row Scales (Shifted) */}
                        <path d="M -14 7 A 14 14 0 0 1 14 7" fill="none" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M 14 7 A 14 14 0 0 1 42 7" fill="none" stroke="currentColor" strokeWidth="1.3" />

                        <path d="M 0 28 A 14 14 0 0 1 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    </pattern>
                    <clipPath id="scale-clip-2">
                        <circle cx="50" cy="50" r="38" />
                    </clipPath>
                </defs>

                {/* Content */}
                <g clipPath="url(#scale-clip-2)">
                    <rect x="0" y="0" width="100" height="100" fill="url(#scale-grid)" />
                </g>

                {/* Outline */}
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" />
            </svg>
        ),
    },
    {
        id: "trapezoid",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <clipPath id="skew-clip">
                        <polygon points="17,26 83,17 83,73 17,83" />
                    </clipPath>
                </defs>
                {/* Outline */}
                <polygon points="15,25 85,15 85,75 15,85" stroke="currentColor" strokeLinejoin="round" strokeWidth="4" />
                {/* Content */}
                <g clipPath="url(#skew-clip)">
                    {/* Zigzag Verticals */}
                    <path d="M 38 21 L 38 80 M 61 19 L 61 77" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                    {/* Zigzag Horizontals */}
                    <path d="M 17 48 L 38 41 L 61 44 L 83 37" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" strokeOpacity="0.4" />
                    <path d="M 17 68 L 38 61 L 61 64 L 83 57" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" strokeOpacity="0.4" />
                </g>
            </svg>
        ),
    },
];

export default function PatternSection() {
    return (
        <section className="py-10 md:py-12 bg-white/30 backdrop-blur-md">
            <div className="layout-inner">
                <div className="flex gap-4 overflow-x-auto pb-6 snap-x no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {patterns.map((item) => (
                        <div key={item.id} className="min-w-[100px] sm:min-w-[120px] aspect-square flex-1 snap-center">
                            <div className="w-full h-full relative overflow-hidden flex items-center justify-center text-neutral-800 hover:text-(--mosaic-teal) transition-colors duration-300">
                                {item.svg}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
