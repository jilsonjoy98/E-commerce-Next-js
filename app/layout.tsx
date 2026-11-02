import type { Metadata, Viewport } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import "./globals.css";

//fixing navbar build problem

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ea580c", // Orange theme accent
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "eShop — Modern Online Shopping & Curated Products",
    template: "%s | eShop",
  },
  description:
    "Explore top-rated electronics, fashion, toys, cosmetics, and curated seasonal deals with fast nationwide delivery and guaranteed genuine warranty.",
  keywords: [
    "e-commerce",
    "online shopping",
    "electronics",
    "headphones",
    "smart devices",
    "fashion",
    "toys",
    "skincare",
    "cosmetics",
    "deals",
  ],
  authors: [{ name: "eShop Team" }],
  creator: "eShop",
  publisher: "eShop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "eShop",
    title: "eShop — Modern Online Shopping & Curated Products",
    description:
      "Explore top-rated electronics, fashion, toys, cosmetics, and curated seasonal deals with fast nationwide delivery.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "eShop - Premium Online Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "eShop — Modern Online Shopping",
    description:
      "Explore top-rated electronics, fashion, toys, cosmetics, and curated seasonal deals.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
