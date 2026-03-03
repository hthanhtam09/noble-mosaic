"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useBanners } from "@/hooks/api/useBanners";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HeroBanner() {
  const { data: banners, isLoading } = useBanners();

  // Filter for active banners only on the public storefront
  const activeBanners = banners?.filter(banner => banner.isActive) || [];

  if (isLoading || !activeBanners.length) {
    // Return an empty skeleton or null to let next components load gracefully
    return (
      <section className="layout-inner hero-banner relative w-full pt-8 pb-10 md:pt-12 md:pb-16">
        <div className="mx-auto max-w-screen">
          <div className="w-full relative rounded-[32px] overflow-hidden h-[60vh] md:h-[80vh] bg-neutral-100 animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="layout-inner hero-banner relative w-full pt-8 pb-10 md:pt-12 md:pb-16">
      <div className="mx-auto max-w-screen">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          loop={activeBanners.length > 1}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="w-full pb-14"
        >
          {activeBanners.map((banner) => (
            <SwiperSlide key={banner._id}>
              {banner.link ? (
                <Link
                  href={banner.link}
                  className="block w-full relative group rounded-[32px] overflow-hidden h-[60vh] md:h-[80vh] shadow-sm transform transition-transform duration-500"
                >
                  <Image
                    src={banner.imageUrl}
                    alt="Banner Image"
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover"
                  />
                  {/* Keeps SEO structure but removes visual overlay */}
                  <div className="sr-only">
                    <h1>Explore Noble Mosaic</h1>
                    <p>Mindful collection</p>
                  </div>
                </Link>
              ) : (
                <div className="block w-full relative group rounded-[32px] overflow-hidden h-[60vh] md:h-[80vh] shadow-sm transform transition-transform duration-500">
                  <Image
                    src={banner.imageUrl}
                    alt="Banner Image"
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover"
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
