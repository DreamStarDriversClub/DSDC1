import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WishlistClient from "./WishlistClient";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved items at Dream Star Drivers Club.",
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          salePrice: true,
          images: true,
          inventory: true,
        },
      },
    },
  });

  return (
    <WishlistClient
      items={JSON.parse(JSON.stringify(items))}
    />
  );
}
