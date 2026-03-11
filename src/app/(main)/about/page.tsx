import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { patterns } from '@/utils/patternsData';
import { Brain, Sparkles, Compass, MonitorOff, CheckCircle2, Instagram, Facebook } from 'lucide-react';
import { FaqJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About Noble Mosaic | A Quiet Space for Creativity',
  description:
    'Discover the story behind Noble Mosaic: premium mosaic-style coloring books offering a mindful, screen-free way to slow down and reconnect with creativity.',
  keywords: [
    'Noble Mosaic',
    'about us',
    'mosaic coloring books',
    'color by number',
    'mindful coloring',
    'adult coloring books',
    'screen-free hobby',
    'creative relaxation',
  ],
  alternates: {
    canonical: 'https://noblemosaic.com/about',
  },
  openGraph: {
    title: 'About Noble Mosaic | A Quiet Space for Creativity',
    description:
      'Discover the story behind Noble Mosaic and why our mosaic-style coloring books are the perfect screen-free hobby for mindful relaxation and focus.',
    url: 'https://noblemosaic.com/about',
    type: 'website',
    siteName: 'Noble Mosaic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Noble Mosaic | A Quiet Space for Creativity',
    description:
      'Discover the story behind Noble Mosaic: a mindful, screen-free way to slow down and reconnect with creativity.',
  },
};

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'About', url: 'https://noblemosaic.com/about' },
        ]}
      />
      <FaqJsonLd
        items={[
          {
            question: 'What is Noble Mosaic?',
            answer:
              'Noble Mosaic creates premium mosaic color-by-number books designed to offer a simple, mindful way to slow down and reconnect with creativity in a noisy world.',
          },
          {
            question: 'What makes mosaic coloring unique?',
            answer:
              'Instead of traditional outlines, each illustration is built from hundreds of small geometric tiles. As you fill them in color by color, hidden images gradually emerge, offering a relaxing and deeply satisfying screen-free experience.',
          },
          {
            question: 'Who are Noble Mosaic books for?',
            answer:
              'Our books are perfect for adults who enjoy relaxing hobbies, fans of color-by-number art, and anyone looking for a calm creative activity or a peaceful break from digital screens.',
          },
          {
            question: 'What is the meaning behind the name Noble Mosaic?',
            answer:
              '"Noble" represents something refined and thoughtful, reflecting the belief that creativity can be calm and meaningful. "Mosaic" reflects art built from small, intentional pieces that come together to reveal something unexpectedly beautiful.',
          },
        ]}
      />

      <div className="selection:bg-neutral-200 selection:text-neutral-900">
        {/* 1. Hero Section */}
        <section className="relative bg-linear-to-b from-stone-50 to-white pt-12 pb-16 lg:pb-24">
          <div className="layout-inner max-w-5xl mx-auto flex flex-col items-center text-center">
            <div className="relative aspect-21/12 w-full bg-stone-200 rounded-2xl mb-12 flex items-center justify-center text-stone-400 border border-stone-200 shadow-sm overflow-hidden">
              <Image
                src="/banner.png"
                alt="Noble Mosaic - A quiet space for creativity"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-showcase font-serif text-neutral-900 mb-6 max-w-3xl leading-tight">
              A quiet space for creativity
            </h1>

            <p className="text-xl md:text-2xl text-neutral-500 mb-8 font-light italic">
              in a noisy world.
            </p>

            <Link href="/books">
              <Button size="lg" className="rounded-full px-8 text-base h-14 bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm transition-all duration-300 hover:shadow-md">
                Explore Our Books
              </Button>
            </Link>
          </div>
        </section>

        {/* 2. Brand Story / Begin */}
        <section className="py-16 lg:py-24 bg-white border-t border-stone-100">
          <div className="layout-inner max-w-8xl">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-8">
                  How Noble Mosaic Began
                </h2>
                <div className="space-y-5 text-lg text-neutral-600 font-light leading-relaxed">
                  <p>
                    In a world filled with endless notifications, constant scrolling, and digital noise, finding a moment of calm can feel surprisingly rare.
                  </p>
                  <p>
                    Noble Mosaic was created to offer something different — a simple, mindful way to slow down and reconnect with creativity.
                  </p>
                  <p>
                    A few years ago, I discovered how powerful simple focus can be. Like many people, I spent a lot of time online. My mind was always busy, but rarely calm. Then I found mosaic-style coloring.
                  </p>
                  <p>
                    At first glance, it looked simple: small shapes, numbers, and colors. But once I started filling them in, something unexpected happened. My mind began to settle into a quiet rhythm.
                  </p>
                  <p>
                    Color after color. Shape after shape. Slowly, an image appeared.
                  </p>
                  <p>
                    It felt almost meditative — a moment where everything else faded away and attention narrowed to the present. That experience became more than a hobby. It became a ritual.
                  </p>
                  <p className="text-neutral-900 font-medium">
                    And that feeling is the heart of Noble Mosaic.
                  </p>
                </div>
              </div>
              <div className="relative aspect-3/4 md:aspect-4/5 w-full flex items-center justify-center">
                <Image
                  src="/banner-1.png"
                  alt="Noble Mosaic - A quiet space for creativity"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Meaning Behind the Name */}
        <section className="py-16 lg:py-24 bg-stone-50 border-t border-stone-100">
          <div className="layout-inner max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-6">
                The Story Behind the Name
              </h2>
              <p className="text-xl text-neutral-600 font-light max-w-2xl mx-auto">
                Hey, I&apos;m Noble Mosaic — and yes, that&apos;s a chosen name. I created this brand with intention.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-white p-10 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] border border-stone-200/60">
                <h3 className="text-3xl font-serif text-neutral-900 mb-6 border-b border-stone-100 pb-4 inline-block">Noble</h3>
                <p className="text-lg text-neutral-600 font-light leading-relaxed">
                  &quot;Noble&quot; represents something refined, thoughtful, and lasting — a quiet kind of elegance that doesn&apos;t need to shout. It reflects the belief that creativity can be calm, meaningful, and deeply satisfying.
                </p>
              </div>
              <div className="bg-white p-10 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] border border-stone-200/60">
                <h3 className="text-3xl font-serif text-neutral-900 mb-6 border-b border-stone-100 pb-4 inline-block">Mosaic</h3>
                <p className="text-lg text-neutral-600 font-light leading-relaxed">
                  &quot;Mosaic&quot; reflects my love for art built from small, intentional pieces — tiny fragments that come together to reveal something unexpectedly beautiful.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl font-serif text-neutral-800 leading-relaxed italic mb-4">
                Together, Noble Mosaic symbolizes the idea that even the smallest details can create something meaningful and elevated.
              </p>
              <p className="text-lg text-neutral-500 font-light">
                A mosaic reminds us that beauty doesn&apos;t always appear all at once. Sometimes it emerges slowly, piece by piece.
              </p>
            </div>
          </div>
        </section>

        {/* 4. What Makes Mosaic Coloring Special */}
        <section className="py-20 lg:py-28 bg-white border-t border-stone-100">
          <div className="layout-inner max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-6">
                What Makes Mosaic Coloring Unique
              </h2>
              <p className="text-lg text-neutral-600 font-light leading-relaxed">
                Mosaic coloring books offer a different kind of creative experience. Instead of traditional outlines, each illustration is built from hundreds of small geometric tiles. At first, the page looks abstract — almost like a puzzle waiting to be solved. But as colors fill each section, hidden images gradually emerge.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-105 group-hover:bg-stone-100 duration-300">
                  <Brain className="w-9 h-9 text-neutral-800" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-3">Relaxing Focus</h3>
                <p className="text-neutral-500 font-light leading-relaxed">Structured creativity that helps calm the mind</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-105 group-hover:bg-stone-100 duration-300">
                  <Sparkles className="w-9 h-9 text-neutral-800" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-3">Hidden Images</h3>
                <p className="text-neutral-500 font-light leading-relaxed">Watch illustrations slowly appear as you color</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-105 group-hover:bg-stone-100 duration-300">
                  <Compass className="w-9 h-9 text-neutral-800" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-3">Creative Discovery</h3>
                <p className="text-neutral-500 font-light leading-relaxed">Every page feels like solving a visual puzzle</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-105 group-hover:bg-stone-100 duration-300">
                  <MonitorOff className="w-9 h-9 text-neutral-800" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-3">Screen-Free Hobby</h3>
                <p className="text-neutral-500 font-light leading-relaxed">A peaceful break from digital life and screens</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Image Break */}
        {/* <section className="bg-white pb-12">
          <div className="layout-inner max-w-7xl">
            <div className="relative aspect-video md:aspect-21/9 w-full bg-stone-100 flex flex-col items-center justify-center text-stone-400 border-y border-stone-200">
              <span className="font-medium tracking-wide">Image: Full Width Break</span>
            </div>
          </div>
        </section> */}

        {/* 6. Who These Books Are For */}
        <section className="py-20 lg:py-28 bg-stone-50 border-t border-stone-100">
          <div className="layout-inner max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-6">
                Designed for Relaxation and Focus
              </h2>
              <p className="text-lg text-neutral-600 font-light leading-relaxed max-w-3xl mx-auto">
                Every book created under Noble Mosaic is designed with a simple goal: To create a relaxing and rewarding coloring experience. Because of this, mosaic coloring books have become a favorite activity for adults and teens looking for a calm, screen-free hobby.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 md:p-14 text-left max-w-3xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-stone-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 point-events-none"></div>

              <h3 className="text-2xl font-serif text-neutral-900 mb-8 relative z-10">
                These books are perfect for:
              </h3>

              <ul className="space-y-6 relative z-10">
                <li className="flex items-start">
                  <div className="mt-1 bg-neutral-900 rounded-full p-1 mr-5 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xl text-neutral-700 font-light">Adults who enjoy relaxing hobbies</span>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 bg-neutral-900 rounded-full p-1 mr-5 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xl text-neutral-700 font-light">Fans of color-by-number art</span>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 bg-neutral-900 rounded-full p-1 mr-5 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xl text-neutral-700 font-light">People looking for a calm creative activity</span>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 bg-neutral-900 rounded-full p-1 mr-5 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xl text-neutral-700 font-light">Anyone wanting a break from screens</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. Creative Process */}
        <section className="py-20 lg:py-28 bg-white border-t border-stone-100">
          <div className="layout-inner max-w-8xl">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 w-full relative z-10">
                {patterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="w-full min-w-25 md:min-w-30 bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-stone-100 flex flex-col items-center justify-center text-neutral-800 transition-transform hover:scale-105 duration-300 gap-4 h-full min-h-40"
                    title={pattern.name}
                  >
                    <div className="w-full max-w-full aspect-square flex-1 flex items-center justify-center">
                      {pattern.svg}
                    </div>
                    <span className="text-base font-semibold text-neutral-700 text-center leading-tight whitespace-nowrap h-10 flex items-center justify-center mt-auto">
                      {pattern.name}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-8">
                  How Our Mosaic Designs Are Created
                </h2>
                <div className="space-y-6 text-lg text-neutral-600 font-light leading-relaxed">
                  <p>
                    Each mosaic illustration is carefully structured to balance challenge and enjoyment. The shapes are arranged so that the image reveals itself gradually, making every page feel like a small creative journey.
                  </p>
                  <p>
                    Through mosaic-style coloring books, Noble Mosaic invites you to step into a quiet rhythm of color, shape, and focus.
                  </p>
                  <p>
                    Whether you spend five minutes coloring or an entire evening, the process encourages patience, focus, and calm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Community Section */}
        <section className="py-20 lg:py-24 bg-stone-50 border-t border-stone-100">
          <div className="layout-inner max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-8">
              Join the Noble Mosaic Community
            </h2>
            <div className="space-y-5 text-lg text-neutral-600 font-light leading-relaxed mb-12 max-w-3xl mx-auto">
              <p>
                Coloring is often a personal activity, but it can also bring people together. Many readers enjoy sharing their finished pages, discovering new books, and connecting with others who love creative relaxation.
              </p>
              <p>
                Seeing how different people bring the same mosaic page to life with their own colors is one of the most inspiring parts of this journey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-10 mb-12">
              <a href="https://instagram.com/noblemosaic" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition-colors bg-white px-6 py-3 rounded-full shadow-sm hover:shadow border border-stone-200">
                <Instagram className="w-5 h-5 text-neutral-800" />
                <span className="font-medium">Instagram</span>
              </a>
              <a href="https://tiktok.com/@noblemosaic" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition-colors bg-white px-6 py-3 rounded-full shadow-sm hover:shadow border border-stone-200">
                <TikTokIcon className="w-5 h-5 text-black" />
                <span className="font-medium">TikTok</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition-colors bg-white px-6 py-3 rounded-full shadow-sm hover:shadow border border-stone-200">
                <Facebook className="w-5 h-5 text-neutral-800" />
                <span className="font-medium">Facebook Group</span>
              </a>
            </div>

            <div className="inline-block px-10 py-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <p className="text-neutral-600 font-medium tracking-wide">
                <span className="text-neutral-400">Share your artwork using</span>
                <br />
                <span className="text-neutral-900">#noblemosaic</span> <span className="mx-3 text-stone-300">|</span> <span className="text-neutral-900">#noblemosaiccoloring</span>
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-white text-center border-t border-stone-100">
          <div className="layout-inner max-w-4xl mx-auto">
            <p className="text-3xl md:text-4xl font-serif text-neutral-900 mb-10 leading-relaxed max-w-2xl mx-auto">
              Sometimes the most beautiful things<br className="hidden md:block" /> are created slowly.
            </p>

            <div className="space-y-3 text-xl md:text-2xl text-neutral-500 font-light italic mb-16">
              <p>One square.</p>
              <p>One color.</p>
              <p>One mindful moment at a time.</p>
            </div>

            <Link href="/books">
              <Button size="lg" className="rounded-full text-lg h-16 bg-neutral-900 text-white hover:bg-neutral-800 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                Browse Our Mosaic Coloring Books
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
