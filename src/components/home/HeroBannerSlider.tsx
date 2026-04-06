"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroBannerSlider({ heroBanners }: { heroBanners: any[] }) {
  return (
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
      className="w-full"
    >
      {heroBanners.map((banner, index) => (
        <SwiperSlide key={banner._id}>
          <Link
            href={banner.link}
            className="block w-full relative group rounded-2xl md:rounded-4xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] transform transition-transform duration-500"
          >
            {/* PC */}
            <Image
              src={banner.imagePc || banner.image || ''}
              alt={banner.title || 'Banner - PC'}
              fill
              priority={index === 0}
              quality={70}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="hidden md:block object-cover"
            />
            {/* Tablet */}
            <Image
              src={banner.imageTablet || banner.image || ''}
              alt={banner.title || 'Banner - Tablet'}
              fill
              priority={index === 0}
              quality={70}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="(max-width: 1024px) 100vw, 100vw"
              className="hidden sm:block md:hidden object-cover"
            />
            {/* Mobile */}
            <Image
              src={banner.imageMobile || banner.image || ''}
              alt={banner.title || 'Banner - Mobile'}
              fill
              priority={index === 0}
              quality={70}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="(max-width: 640px) 100vw, 100vw"
              className="block sm:hidden object-cover"
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
  );
}
