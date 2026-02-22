import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://noblemosaic.com'),
  title: {
    default: "Noble Mosaic | Premium Mosaic Color By Number Books",
    template: "%s | Noble Mosaic"
  },
  description: "Discover premium mosaic color by number books designed for mindful relaxation and creative expression. Relax, focus, and create beautiful artwork with our unique hidden-image coloring pages.",
  keywords: [
    "color by number",
    "mosaic coloring books",
    "adult coloring books",
    "stress relief coloring",
    "mindfulness activities",
    "creative hobbies",
    "coloring books for adults",
    "mosaic art",
    "color by number for adults",
    "relaxation coloring",
    "hidden image coloring",
    "therapeutic coloring",
    "premium coloring books",
  ],
  authors: [{ name: "Noble Mosaic" }],
  creator: "Noble Mosaic",
  publisher: "Noble Mosaic",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "16x16" },
    ],
    apple: "/logo.png",
  },
  alternates: {
    canonical: 'https://noblemosaic.com',
  },
  openGraph: {
    title: "Noble Mosaic | Premium Mosaic Color By Number Books",
    description: "Discover premium mosaic color by number books designed for mindful relaxation and creative expression. Unique hidden-image designs for adults.",
    url: "https://noblemosaic.com",
    siteName: "Noble Mosaic",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Noble Mosaic - Premium Mosaic Color By Number Books",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noble Mosaic | Premium Mosaic Color By Number Books",
    description: "Discover premium mosaic color by number books designed for mindful relaxation and creative expression.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Replace with your actual verification codes
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
