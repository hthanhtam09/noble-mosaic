import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Noble Mosaic | Premium Mosaic Color By Number Books",
    template: "%s | Noble Mosaic"
  },
  description: "Discover premium mosaic color by number books designed for mindful relaxation and creative expression. Relax, focus, and create beautiful artwork.",
  keywords: ["color by number", "mosaic coloring books", "adult coloring", "stress relief", "mindfulness", "creative hobbies", "coloring books for adults"],
  authors: [{ name: "Noble Mosaic" }],
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32" },
      { url: "/favicon.png", sizes: "16x16" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Noble Mosaic | Premium Mosaic Color By Number Books",
    description: "Discover premium mosaic color by number books designed for mindful relaxation and creative expression.",
    url: "https://noblemosaic.com",
    siteName: "Noble Mosaic",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Noble Mosaic Coloring Books",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noble Mosaic | Premium Mosaic Color By Number Books",
    description: "Discover premium mosaic color by number books designed for mindful relaxation and creative expression.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
