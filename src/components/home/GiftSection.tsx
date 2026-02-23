"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGiftFolders } from "@/hooks/api/useGift";
import {
  Gift, ArrowRight, Sparkles, Loader2,
  Mail, ShieldCheck, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GiftSection() {
  const router = useRouter();
  const { data: folders = [], isLoading } = useGiftFolders();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("gift_verified") === "true") {
      setIsSubscribed(true);
    }
  }, []);

  const previewImages = folders
    .flatMap((folder) =>
      (folder.pages || []).map((page) => ({
        id: page._id,
        imageUrl: page.imageUrl,
        title: page.title,
      }))
    )
    .slice(0, 6);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setStep("verify");
      else setError(data.error || "Failed to send verification code");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "gift", code }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("gift_verified", "true");
        router.push("/gift");
      } else {
        setError(data.error || "Invalid or expired code");
      }
    } catch {
      setError("Failed to verify code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const placeholderColors = [
    "var(--mosaic-coral)", "var(--mosaic-teal)", "var(--mosaic-purple)",
    "var(--mosaic-gold)", "var(--mosaic-sage)", "var(--mosaic-rose)",
  ];

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--mosaic-purple)]/5 via-transparent to-[var(--mosaic-coral)]/5" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--mosaic-gold)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[var(--mosaic-teal)]/10 rounded-full blur-3xl" />

      <div className="layout-inner relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--mosaic-coral)]/10 to-[var(--mosaic-purple)]/10 text-[var(--mosaic-purple)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              Free Gift
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 font-nunito mb-4 leading-tight">
              Get Your Free{" "}
              <span className="bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] bg-clip-text text-transparent">
                Coloring Pages
              </span>
            </h2>

            <p className="text-neutral-600 text-base md:text-lg mb-8 leading-relaxed max-w-lg">
              {isSubscribed
                ? "Your gift is unlocked! Head over to the Gift page to download all your free coloring pages."
                : "Unlock beautiful hand-drawn coloring pages — completely free! Just verify your email and start coloring right away."}
            </p>

            {/* Subscribed: CTA to gift page */}
            {isSubscribed ? (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] hover:opacity-90 text-white rounded-full px-8 py-6 text-base font-bold font-nunito shadow-lg shadow-[var(--mosaic-purple)]/20 group"
              >
                <Link href="/gift">
                  <Gift className="mr-2 h-5 w-5" />
                  Go to Gift Page
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              /* Not subscribed: email form */
              <div className="max-w-md">
                {step === "email" ? (
                  <form onSubmit={handleSendCode} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 text-base rounded-xl border-2 focus:border-[var(--mosaic-purple)] bg-white"
                        required
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 p-2.5 rounded-xl text-center">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 text-base bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] hover:opacity-90 text-white rounded-xl shadow-lg shadow-[var(--mosaic-purple)]/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending Code...
                        </>
                      ) : (
                        <>
                          <Gift className="mr-2 h-5 w-5" />
                          Unlock Free Gift
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-neutral-500">
                      We&apos;ll send a verification code to your email.
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleVerify} className="space-y-3">
                    <p className="text-sm text-neutral-600 mb-2">
                      We&apos;ve sent a 6-digit code to{" "}
                      <strong className="text-neutral-900">{email}</strong>
                    </p>

                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="h-14 text-center text-2xl tracking-[0.3em] font-mono rounded-xl border-2 focus:border-[var(--mosaic-purple)] bg-white"
                      required
                    />

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 p-2.5 rounded-xl text-center">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting || code.length !== 6}
                      className="w-full h-12 text-base bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] hover:opacity-90 text-white rounded-xl shadow-lg shadow-[var(--mosaic-purple)]/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-5 w-5" />
                          Verify & Unlock
                        </>
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={() => { setStep("email"); setError(""); setCode(""); }}
                      className="text-sm text-neutral-500 hover:text-neutral-900 underline w-full text-center"
                    >
                      Change email address
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right: Preview Grid */}
          <div className="order-1 lg:order-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
              </div>
            ) : previewImages.length > 0 ? (
              <Link href="/gift" className="block group">
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {previewImages.map((img) => (
                    <div
                      key={img.id}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-0.5 ${
                        !isSubscribed ? "grayscale opacity-80" : ""
                      }`}
                    >
                      <Image
                        src={img.imageUrl}
                        alt={img.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 30vw, (max-width: 1024px) 20vw, 15vw"
                      />
                      {!isSubscribed && (
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                            <Lock className="h-5 w-5 text-neutral-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-neutral-500 mt-4 group-hover:text-neutral-700 transition-colors">
                  {isSubscribed ? "Click to download on Gift page →" : "Subscribe to unlock all pages"}
                </p>
              </Link>
            ) : (
              <Link href="/gift" className="block group">
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {placeholderColors.map((color, i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] rounded-2xl overflow-hidden flex items-center justify-center group-hover:shadow-md transition-all"
                      style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)` }}
                    >
                      <Gift className="h-8 w-8 opacity-20" style={{ color }} />
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-neutral-500 mt-4 group-hover:text-neutral-700 transition-colors">
                  Visit Gift page to explore →
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
