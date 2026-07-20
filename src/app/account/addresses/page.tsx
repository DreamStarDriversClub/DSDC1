import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddressesClient from "./AddressesClient";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Addresses",
  description: "Manage your shipping and billing addresses at Dream Star Drivers Club.",
};

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { id: "desc" }],
  });

  return <AddressesClient addresses={JSON.parse(JSON.stringify(addresses))} />;
}
