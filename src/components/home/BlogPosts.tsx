"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const blogPosts = [
  {
    title: "How to Color",
    description:
      "Step-by-step coloring tips to relax, explore, and bring your favorite pages to life.",
    href: "/blog",
  },
  {
    title: "Choosing Made Easy",
    description:
      "Helpful guides for choosing coloring books and tools that match your style and mood.",
    href: "/blog",
  },
];

export default function BlogPosts() {
  const [blogSliderIndex, setBlogSliderIndex] = useState(0);

  const handlePrevBlogSlide = () => {
    setBlogSliderIndex((prev) =>
      prev === 0 ? blogPosts.length - 1 : prev - 1,
    );
  };

  const handleNextBlogSlide = () => {
    setBlogSliderIndex((prev) =>
      prev === blogPosts.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16">
        <h2 className="text-xl md:text-2xl font-extrabold text-neutral-800 mb-6 font-nunito">
          Blog Posts
        </h2>
        <div className="relative rounded-2xl bg-white p-8 md:p-12 shadow-sm border border-neutral-100 overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${blogSliderIndex * 100}%)`,
            }}
          >
            {blogPosts.map((post) => (
              <div
                key={post.title}
                className="min-w-full flex-shrink-0 px-2"
              >
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4 font-nunito">
                  {post.title}
                </h3>
                <p className="text-neutral-600 mb-6 max-w-2xl">
                  {post.description}
                </p>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href={post.href}>
                    Read more
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none md:pointer-events-auto">
            <button
              type="button"
              onClick={handlePrevBlogSlide}
              className="w-10 h-10 rounded-full bg-white/90 shadow-md border border-neutral-200 flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Previous blog post"
            >
              <ChevronLeft className="h-5 w-5 text-neutral-700" />
            </button>
            <button
              type="button"
              onClick={handleNextBlogSlide}
              className="w-10 h-10 rounded-full bg-white/90 shadow-md border border-neutral-200 flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Next blog post"
            >
              <ChevronRight className="h-5 w-5 text-neutral-700" />
            </button>
          </div>
          <div className="flex gap-2 mt-6 justify-center">
            {blogPosts.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setBlogSliderIndex(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === blogSliderIndex
                    ? "bg-neutral-900"
                    : "bg-neutral-300 hover:bg-neutral-400",
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
