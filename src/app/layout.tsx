import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BRAND_NAME, TAGLINE } from "@/lib/constants";
import { getSession } from "@/lib/auth";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dreamstardriversclub.com"),
  title: {
    template: `%s | ${BRAND_NAME}`,
    default: `${BRAND_NAME} — ${TAGLINE}`,
  },
  description:
    "Dream Star Drivers Club — premium JDM lifestyle brand. Apparel, accessories, and performance parts for rotary and 2JZ enthusiasts. Chase the Horizon.",
  keywords: [
    "JDM",
    "Mazda rotary",
    "Toyota 2JZ",
    "automotive lifestyle",
    "car culture",
    "streetwear",
    "performance parts",
    "rotary engine",
    "Dream Star Drivers Club",
    "Japanese cars",
    "RX-7",
    "Supra",
    "JDM apparel",
  ],
  authors: [{ name: "Dream Star Drivers Club" }],
  creator: "Dream Star Drivers Club",
  publisher: "Dream Star Drivers Club",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dreamstardriversclub.com",
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} — ${TAGLINE}`,
    description:
      "Dream Star Drivers Club — premium JDM lifestyle brand. Apparel, accessories, and performance parts for rotary and 2JZ enthusiasts. Chase the Horizon.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: BRAND_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — ${TAGLINE}`,
    description:
      "Premium automotive lifestyle brand rooted in Japanese car culture.",
    images: ["/og-image.png"],
    creator: "@dreamstardc",
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
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-ds-black text-ds-white antialiased">
        <CartProvider>
          {/* Subtle noise texture */}
          <div className="bg-noise">
            <Navbar session={session} />
            {/* Spacer for fixed navbar */}
            <div className="h-[73px]" />
            <main>{children}</main>
            <Footer />
            <ScrollToTop />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
