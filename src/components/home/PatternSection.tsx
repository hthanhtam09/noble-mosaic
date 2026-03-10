"use client";

import { patterns } from "../../utils/patternsData";

export default function PatternSection() {
    return (
        <section className="py-10 md:py-12 bg-white/30 backdrop-blur-md">
            <div className="layout-inner">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-800 text-center mb-6">
                    Pattern
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-6 snap-x no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {patterns.map((item) => (
                        <div key={item.id} className="min-w-[100px] sm:min-w-[120px] flex-1 snap-center flex flex-col items-center gap-3">
                            <div className="w-full aspect-square relative overflow-hidden flex items-center justify-center text-neutral-800">
                                {item.svg}
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-neutral-700 text-center leading-tight">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
