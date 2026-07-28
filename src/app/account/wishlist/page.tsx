import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved items at Dream Star Drivers Club.",
};

export const dynamic = "force-dynamic";

export default function WishlistPage() {
  return (
    <Container className="py-16 text-center">
      <h1 className="font-display text-2xl font-bold text-ds-white mb-4">My Garage</h1>
      <p className="text-ds-gray-400 mb-8">
        Visit the new My Garage page to see your saved items.
      </p>
      <Link href="/wishlist">
        <Button>Go to My Garage</Button>
      </Link>
    </Container>
  );
}
