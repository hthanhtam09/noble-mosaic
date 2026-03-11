"use client";

import { patterns } from "../../utils/patternsData";

export default function PatternSection() {
    return (
        <section className="py-10 md:py-12">
            <div className="layout-inner">
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-800">
                        Pattern
                    </h2>
                    {/* UI/UX Hint cho Mobile: Chỉ dẫn vuốt */}
                    <div className="md:hidden flex items-center justify-center gap-1.5 text-neutral-400 text-[10px] mt-2 animate-pulse">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        <span className="uppercase tracking-wider font-medium">Scroll to see more</span>
                    </div>
                </div>

                <div 
                    className="mx-auto w-max max-w-full flex gap-4 overflow-x-auto pb-3 snap-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4d4d8 transparent' }}
                >
                    {patterns.map((item) => (
                        <div key={item.id} className="w-[120px] sm:w-[140px] flex-none snap-center flex flex-col items-center gap-2">
                            <div className="w-full aspect-square relative overflow-hidden flex items-center justify-center text-neutral-800">
                                {item.svg}
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold text-neutral-700 text-center leading-tight">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
