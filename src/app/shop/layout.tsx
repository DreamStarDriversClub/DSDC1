import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the complete Dream Star Drivers Club catalog — premium apparel, accessories, and Mazda rotary performance parts.",
  openGraph: {
    title: `Shop All | ${BRAND_NAME}`,
    description: "Browse the complete Dream Star Drivers Club catalog.",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
