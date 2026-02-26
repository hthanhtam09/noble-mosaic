import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Target, Sparkles, Users, BookOpen, Brain, Palette, Leaf } from 'lucide-react';
import { FaqJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About Us - Our Story & Mission',
  description:
    'Learn about Noble Mosaic — we create premium mosaic color by number books designed for mindful relaxation and creative expression. Discover our mission, values, and the therapeutic benefits of coloring.',
  alternates: {
    canonical: 'https://noblemosaic.com/about',
  },
  openGraph: {
    title: 'About Noble Mosaic - Our Story & Mission',
    description:
      'We create premium mosaic color by number books designed for mindful relaxation and creative expression.',
    url: 'https://noblemosaic.com/about',
    type: 'website',
  },
};

const values = [
  {
    icon: Heart,
    title: 'Mindful Creation',
    description: 'We believe in the power of mindful creativity. Every design is crafted to help you find peace in the present moment.',
  },
  {
    icon: Target,
    title: 'Quality First',
    description: 'From paper quality to design intricacy, we never compromise. Our books are made to last and bring joy for years.',
  },
  {
    icon: Sparkles,
    title: 'Artistic Excellence',
    description: 'Our team of artists creates original, stunning mosaic patterns you won\'t find anywhere else.',
  },
  {
    icon: Users,
    title: 'Community Focus',
    description: 'We\'re building a community of colorists who share their passion and inspire each other.',
  },
];

const timeline = [
  {
    year: '2020',
    title: 'The Beginning',
    description: 'Noble Mosaic was born from a simple idea: make the therapeutic benefits of coloring accessible to everyone.',
  },
  {
    year: '2021',
    title: 'Growing Collection',
    description: 'We expanded our catalog with original patterns catering to enthusiasts of all levels.',
  },
  {
    year: '2022',
    title: 'Community Building',
    description: 'Our coloring community grew to thousands of passionate colorists sharing their creations.',
  },
  {
    year: '2023',
    title: 'Premium Partnership',
    description: 'Partnered with Amazon to bring our books to colorists worldwide with fast, reliable delivery.',
  },
];

const benefits = [
  {
    icon: Brain,
    title: 'Stress Relief',
    description: 'Coloring activates the brain\'s relaxation response, reducing cortisol levels and promoting calm.',
  },
  {
    icon: Palette,
    title: 'Creative Expression',
    description: 'Express yourself through color choices while following satisfying numbered patterns.',
  },
  {
    icon: BookOpen,
    title: 'Focus & Patience',
    description: 'Mosaic coloring improves concentration and teaches the art of patience.',
  },
  {
    icon: Leaf,
    title: 'Digital Detox',
    description: 'Take a break from screens and reconnect with the tactile joy of coloring.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
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
              'Noble Mosaic creates premium mosaic color by number books designed for mindful relaxation and creative expression.',
          },
          {
            question: 'What are the benefits of mosaic coloring?',
            answer:
              'Mosaic coloring provides stress relief, enhances focus and patience, promotes creative expression, and offers a digital detox from screens.',
          },
          {
            question: 'Where can I buy Noble Mosaic books?',
            answer:
              'All Noble Mosaic books are available on Amazon with fast, reliable delivery.',
          },
          {
            question: 'What makes Noble Mosaic coloring books different?',
            answer:
              'Our books feature original mosaic patterns with hidden images that are revealed as you color, premium paper quality, bold easy-to-read numbers, and large 8.5x11 inch format.',
          },
        ]}
      />
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-stone-50 to-white py-16 lg:py-24">
          <div className="layout-inner">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 text-neutral-600 border-neutral-300">
                Our Story
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-6">
                About Noble Mosaic
              </h1>
              <p className="text-lg text-neutral-600 leading-relaxed">
                We&apos;re passionate about bringing the therapeutic joy of mosaic coloring to people around the world.
                Our mission is to help you find moments of peace, creativity, and mindful relaxation through beautiful art.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="layout-inner">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
                  alt="Artistic coloring process"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                  At Noble Mosaic, we believe everyone deserves a moment of peace in their busy lives.
                  Our color by number books are designed to be more than just coloring pages—they&apos;re
                  gateways to relaxation, mindfulness, and creative expression.
                </p>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Each book we create is a labor of love, combining stunning mosaic artwork with
                  the therapeutic benefits of guided coloring. We carefully craft designs that
                  inspire wonder and challenge and delight in equal measure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-24 bg-stone-50">
          <div className="layout-inner">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4">
                What We Stand For
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Our core values guide everything we do, from design to delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-sm bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-neutral-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-neutral-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="layout-inner">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4">
                The Power of Coloring
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Discover why mosaic coloring is more than just a hobby—it&apos;s a path to wellness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4 p-6 rounded-xl bg-stone-50">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-neutral-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{benefit.title}</h3>
                    <p className="text-neutral-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 lg:py-24 bg-neutral-900 text-white">
          <div className="layout-inner">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
                From a passion project to a brand loved by thousands of colorists.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {timeline.map((item, index) => (
                <div key={index} className="relative pl-8 pb-8 last:pb-0">
                  {/* Timeline line */}
                  {index !== timeline.length - 1 && (
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-700" />
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 w-px h-px">
                    <div className="absolute -left-[5px] top-0 w-[10px] h-[10px] rounded-full bg-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-sm text-neutral-400">{item.year}</span>
                    <h3 className="text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                    <p className="text-neutral-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
