import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import NewRelease from "@/components/home/NewRelease";
import SecretSection from "@/components/home/SecretSection";
import GiftFloatingWidget from "@/components/home/GiftFloatingWidget";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://noblemosaic.com',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="grow">
        <HeroBanner />
        <NewRelease />
        <SecretSection />
      </main>

      <Footer />
      <GiftFloatingWidget />
    </div>
  );
}
