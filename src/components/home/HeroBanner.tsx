"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const heroBanners = [
  {
    id: "1",
    title: "Welcome to cozy world",
    subtitle: "Discover therapeutic coloring books for mindful relaxation",
    href: "/shop",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80",
    alt: "Coloring books collection",
  },
  {
    id: "2",
    title: "Relax. Focus. Create.",
    subtitle: "Hand-drawn with love, designed for soothing moments",
    href: "/shop",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1920&q=80",
    alt: "Coloring pencils and book",
  },
  {
    id: "3",
    title: "New Release",
    subtitle: "Explore our latest coloring book designs",
    href: "/shop",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=1920&q=80",
    alt: "Open coloring book",
  },
];

export default function HeroBanner() {
  return (
    <section className="hero-banner relative w-full pt-8 pb-10 md:pt-12 md:pb-16 bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="w-full pb-14"
        >
          {heroBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Link
                href={banner.href}
                className="block w-full relative group rounded-[32px] overflow-hidden h-[60vh] md:h-[80vh] shadow-sm transform transition-transform duration-500"
              >
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                />
                {/* Keeps SEO structure but removes visual overlay */}
                <div className="sr-only">
                  <h1>{banner.title}</h1>
                  <p>{banner.subtitle}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
