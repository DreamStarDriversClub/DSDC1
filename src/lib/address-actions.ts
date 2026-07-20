"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type AddressFormResult = {
  success: boolean;
  error?: string;
};

export async function addAddressAction(
  prev: AddressFormResult,
  formData: FormData
): Promise<AddressFormResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated." };

  const line1 = (formData.get("line1") as string)?.trim();
  const line2 = (formData.get("line2") as string)?.trim() || null;
  const city = (formData.get("city") as string)?.trim();
  const state = (formData.get("state") as string)?.trim();
  const zip = (formData.get("zip") as string)?.trim();
  const country = (formData.get("country") as string)?.trim() || "US";
  const isDefault = formData.get("isDefault") === "on";

  if (!line1 || !city || !state || !zip) {
    return { success: false, error: "Address, city, state, and ZIP are required." };
  }

  // If setting as default, unset others
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  // If this is the first address, make it default
  const count = await prisma.address.count({ where: { userId: session.userId } });

  await prisma.address.create({
    data: {
      userId: session.userId,
      line1,
      line2,
      city,
      state,
      zip,
      country,
      isDefault: count === 0 ? true : isDefault,
    },
  });

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function updateAddressAction(
  prev: AddressFormResult,
  formData: FormData
): Promise<AddressFormResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated." };

  const id = formData.get("id") as string;
  const line1 = (formData.get("line1") as string)?.trim();
  const line2 = (formData.get("line2") as string)?.trim() || null;
  const city = (formData.get("city") as string)?.trim();
  const state = (formData.get("state") as string)?.trim();
  const zip = (formData.get("zip") as string)?.trim();
  const country = (formData.get("country") as string)?.trim() || "US";
  const isDefault = formData.get("isDefault") === "on";

  if (!id || !line1 || !city || !state || !zip) {
    return { success: false, error: "All required fields must be filled." };
  }

  // Verify ownership
  const existing = await prisma.address.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) return { success: false, error: "Address not found." };

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.userId, isDefault: true, id: { not: id } },
      data: { isDefault: false },
    });
  }

  await prisma.address.update({
    where: { id },
    data: { line1, line2, city, state, zip, country, isDefault },
  });

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddressAction(id: string) {
  "use server";
  const session = await getSession();
  if (!session) return;

  const existing = await prisma.address.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) return;

  await prisma.address.delete({ where: { id } });

  // If deleted address was default, make another one default
  if (existing.isDefault) {
    const first = await prisma.address.findFirst({
      where: { userId: session.userId },
      orderBy: { id: "asc" },
    });
    if (first) {
      await prisma.address.update({
        where: { id: first.id },
        data: { isDefault: true },
      });
    }
  }

  revalidatePath("/account/addresses");
}
