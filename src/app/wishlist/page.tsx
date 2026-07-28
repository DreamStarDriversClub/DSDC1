import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { MyGarageContent } from "./MyGarageContent";

export const metadata: Metadata = {
  title: `My Garage | ${BRAND_NAME}`,
  description:
    "Your saved collection of Dream Star Drivers Club apparel, accessories, and performance parts.",
};

export default function WishlistPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-noise" />

        <Container className="relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-display-lg text-ds-white">
              My Garage
            </h1>
            <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mt-6 text-lg text-ds-gray-300">
              Your personal collection of Dream Star gear. Save the pieces
              you&apos;re eyeing and build your ultimate garage.
            </p>
          </div>
        </Container>
      </section>

      {/* Wishlist items (client component) */}
      <section className="bg-ds-black section-padding">
        <Container>
          <MyGarageContent />
        </Container>
      </section>
    </>
  );
}
