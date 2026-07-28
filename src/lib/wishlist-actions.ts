"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function removeFromWishlistAction(productId: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.wishlistItem.deleteMany({
    where: { userId: session.userId, productId },
  });

  revalidatePath("/account/wishlist");
}

export async function addToWishlistAction(
  productId: string,
  productName: string,
  productImage: string,
  productPrice: number,
  productCategory: string
) {
  const session = await getSession();
  if (!session) return;

  const existing = await prisma.wishlistItem.findFirst({
    where: { userId: session.userId, productId },
  });

  if (!existing) {
    await prisma.wishlistItem.create({
      data: {
        userId: session.userId,
        productId,
        productName,
        productImage,
        productPrice,
        productCategory,
      },
    });
  }

  revalidatePath("/account/wishlist");
}
