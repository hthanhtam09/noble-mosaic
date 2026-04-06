"use client";

// Desktop (máy tính): tỷ lệ 21:9 - độ phân giải tối ưu tham khảo: 2100px x 900px hoặc 1920px x 822px
// Tablet (máy tính bảng): tỷ lệ 16:9 - độ phân giải tối ưu tham khảo: 1920px x 1080px
// Mobile (điện thoại): tỷ lệ 4:3 - độ phân giải tối ưu tham khảo: 1200px x 900px hoặc 800px x 600px

import dynamic from "next/dynamic";
import { useBanners } from "@/hooks/api/useBanners";

const HeroBannerSlider = dynamic(() => import("./HeroBannerSlider"), { ssr: true });

export default function HeroBanner({ initialBanners = [] }: { initialBanners?: any[] }) {
  // Use initialBanners for SSR LCP, overriding the client hook if provided
  const { data: heroBannersData = [], isLoading } = useBanners();
  const heroBanners = initialBanners.length > 0 ? initialBanners : heroBannersData;

  if (isLoading && initialBanners.length === 0) {
    return (
      <section className="layout-inner hero-banner relative w-full pt-8 pb-10 md:pt-12 md:pb-16">
        <div className="mx-auto max-w-screen">
          <div className="w-full relative rounded-2xl md:rounded-[32px] overflow-hidden aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] bg-neutral-100/50 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900" />
          </div>
        </div>
      </section>
    );
  }

  if (heroBanners.length === 0) {
    return null;
  }

  return (
    <section className="layout-inner hero-banner relative w-full pt-8 pb-10 md:pt-12 md:pb-16">
      <div className="mx-auto max-w-screen">
        <HeroBannerSlider heroBanners={heroBanners} />
      </div>
    </section>
  );
}
