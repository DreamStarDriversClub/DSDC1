import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/lib/constants";
import { CartProvider } from "@/lib/cart-context";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} — Premium JDM Lifestyle Brand`,
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    "Dream Star Drivers Club — Premium automotive lifestyle brand rooted in Japanese car culture. Apparel, accessories, and performance parts for rotary and 2JZ enthusiasts.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} — Premium JDM Lifestyle Brand`,
    description:
      "Premium automotive lifestyle brand rooted in Japanese car culture.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ds-black text-ds-white font-sans antialiased">
        <CartProvider>
          <Navbar session={session} />
          {/* Spacer for fixed navbar */}
          <div className="h-[73px]" />
          <main>{children}</main>
          <Footer />
          <ScrollToTop />
        </CartProvider>
      </body>
    </html>
  );
}
