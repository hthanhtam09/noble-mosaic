import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import NewRelease from "@/components/home/NewRelease";
import SecretSection from "@/components/home/SecretSection";
import PatternSection from "@/components/home/PatternSection";
import FAQSection from "@/components/home/FAQSection";
import GiftFloatingWidget from "@/components/home/GiftFloatingWidget";
import connectDB from "@/lib/mongodb";
import BannerModel from "@/models/Banner";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://noblemosaic.com',
  },
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let initialBanners: any[] = [];
  try {
    await connectDB();
    const banners = await BannerModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    initialBanners = banners.map((b: any) => ({
      _id: b._id.toString(),
      title: b.title || "",
      subtitle: b.subtitle || "",
      image: b.image || "",
      imagePc: b.imagePc || "",
      imageTablet: b.imageTablet || "",
      imageMobile: b.imageMobile || "",
      link: b.link || "",
      order: b.order || 0,
      isActive: b.isActive || true,
      createdAt: b.createdAt ? b.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: b.updatedAt ? b.updatedAt.toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Failed to fetch banners on SSR:", err);
  }

  return (
    <>
      <HeroBanner initialBanners={initialBanners} />
      <NewRelease />
      <PatternSection />
      <SecretSection />
      <FAQSection />
      <GiftFloatingWidget />
    </>
  );
}
