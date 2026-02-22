import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import NewRelease from "@/components/home/NewRelease";
import BestSeller from "@/components/home/BestSeller";
import GiftSection from "@/components/home/GiftSection";
import BlogPosts from "@/components/home/BlogPosts";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-grow">
        <HeroBanner />
        <NewRelease />
        <BestSeller />
        <GiftSection />
        <BlogPosts />
      </main>

      <Footer />
    </div>
  );
}
