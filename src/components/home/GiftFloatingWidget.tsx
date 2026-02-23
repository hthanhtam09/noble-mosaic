"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Gift, ArrowRight, Sparkles, Loader2,
    Mail, ShieldCheck, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GiftFloatingWidget() {
    const router = useRouter();
    const popoverRef = useRef<HTMLDivElement>(null);

    const [isDismissed, setIsDismissed] = useState(true); // start hidden to avoid flash
    const [isOpen, setIsOpen] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    // form state
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState<"email" | "verify">("email");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // --- mount: read localStorage ---
    useEffect(() => {
        const dismissed = localStorage.getItem("gift_widget_dismissed") === "true";
        setIsDismissed(dismissed);

        if (localStorage.getItem("gift_verified") === "true") {
            setIsSubscribed(true);
        }
    }, []);

    // --- close popover on outside click ---
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // --- handlers ---
    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        localStorage.setItem("gift_widget_dismissed", "true");
        setIsDismissed(true);
    };

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
                setIsSubscribed(true);
                setIsOpen(false);
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

    // --- don't render if dismissed ---
    if (isDismissed) return null;

    return (
        <>
            {/* Modal backdrop + centered modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div
                        ref={popoverRef}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 z-10"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="h-4 w-4 text-neutral-600" />
                        </button>

                        {/* Accent bar */}
                        <div className="h-1.5 bg-gradient-to-r from-[var(--mosaic-coral)] via-[var(--mosaic-gold)] to-[var(--mosaic-purple)]" />

                        <div className="p-8">
                            {isSubscribed ? (
                                /* --- Already subscribed --- */
                                <div className="text-center space-y-5">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--mosaic-coral)]/10 to-[var(--mosaic-purple)]/10 rounded-2xl flex items-center justify-center">
                                        <Sparkles className="h-8 w-8 text-[var(--mosaic-purple)]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 text-xl font-nunito">
                                            Your Gift is Ready!
                                        </h3>
                                        <p className="text-neutral-500 mt-2">
                                            Head over to the Gift page to download your free coloring pages.
                                        </p>
                                    </div>
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] hover:opacity-90 text-white rounded-xl h-12 text-base font-bold font-nunito group"
                                    >
                                        <Link href="/gift">
                                            <Gift className="mr-2 h-5 w-5" />
                                            Go to Gift Page
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                /* --- Not subscribed --- */
                                <div className="space-y-5">
                                    <div className="text-center">
                                        <h3 className="font-bold text-neutral-900 text-xl font-nunito">
                                            🎁 Free Coloring Pages
                                        </h3>
                                        <p className="text-neutral-500 mt-2">
                                            Subscribe to unlock beautiful free coloring pages!
                                        </p>
                                    </div>

                                    {step === "email" ? (
                                        <form onSubmit={handleSendCode} className="space-y-4">
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
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
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Gift className="mr-2 h-5 w-5" />
                                                        Unlock Free Gift
                                                    </>
                                                )}
                                            </Button>

                                            <p className="text-xs text-center text-neutral-400">
                                                We&apos;ll send a verification code to your email.
                                            </p>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleVerify} className="space-y-4">
                                            <p className="text-sm text-neutral-600 text-center">
                                                Code sent to <strong className="text-neutral-900">{email}</strong>
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
                                                Change email
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating icon button — hidden when modal is open */}
            {!isOpen && (
                <div className="fixed bottom-20 right-6 z-50">
                    <div className="relative group">
                        {/* Dismiss button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 bg-neutral-700 hover:bg-neutral-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            aria-label="Dismiss gift widget"
                        >
                            <X className="h-3 w-3" />
                        </button>

                        {/* Main icon */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] text-white flex items-center justify-center shadow-lg shadow-[var(--mosaic-purple)]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                            aria-label="Open gift"
                        >
                            <Gift className="h-6 w-6" />
                        </button>

                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--mosaic-coral)] to-[var(--mosaic-purple)] animate-ping opacity-20 pointer-events-none" />
                    </div>
                </div>
            )}
        </>
    );
}
