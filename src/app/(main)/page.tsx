import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import NewRelease from "@/components/home/NewRelease";
import SecretSection from "@/components/home/SecretSection";
import PatternSection from "@/components/home/PatternSection";
import FAQSection from "@/components/home/FAQSection";
import GiftFloatingWidget from "@/components/home/GiftFloatingWidget";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://noblemosaic.com',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <NewRelease />
      <PatternSection />
      <SecretSection />
      <FAQSection />
      <GiftFloatingWidget />
    </>
  );
}
