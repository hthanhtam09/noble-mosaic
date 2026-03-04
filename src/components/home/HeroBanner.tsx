"use client";

// Desktop (máy tính): tỷ lệ 21:9 - độ phân giải tối ưu tham khảo: 2100px x 900px hoặc 1920px x 822px
// Tablet (máy tính bảng): tỷ lệ 16:9 - độ phân giải tối ưu tham khảo: 1920px x 1080px
// Mobile (điện thoại): tỷ lệ 4:3 - độ phân giải tối ưu tham khảo: 1200px x 900px hoặc 800px x 600px

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useBanners } from "@/hooks/api/useBanners";

export default function HeroBanner() {
  const { data: heroBanners = [], isLoading } = useBanners();

  if (isLoading) {
    return (
      <section className="layout-inner hero-banner relative w-full pt-8 pb-10 md:pt-12 md:pb-16 flex justify-center items-center aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900" />
      </section>
    );
  }

  if (heroBanners.length === 0) {
    return null;
  }

  return (
    <section className="layout-inner hero-banner relative w-full pt-8 pb-10 md:pt-12 md:pb-16">
      <div className="mx-auto max-w-screen">
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
          {heroBanners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <Link
                href={banner.link}
                className="block w-full relative group rounded-2xl md:rounded-[32px] overflow-hidden aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] transform transition-transform duration-500"
              >
                {/* PC */}
                <Image
                  src={banner.imagePc || banner.image || ''}
                  alt={banner.title || 'Banner - PC'}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="hidden md:block object-cover"
                />
                {/* Tablet */}
                <Image
                  src={banner.imageTablet || banner.image || ''}
                  alt={banner.title || 'Banner - Tablet'}
                  fill
                  priority
                  sizes="100vw"
                  className="hidden sm:block md:hidden object-cover"
                />
                {/* Mobile */}
                <Image
                  src={banner.imageMobile || banner.image || ''}
                  alt={banner.title || 'Banner - Mobile'}
                  fill
                  priority
                  sizes="100vw"
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
      </div>
    </section>
  );
}
