import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const BASE_URL = "https://dreamstardriversclub.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/shop/apparel`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/shop/accessories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/shop/performance`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/shop/all`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${BASE_URL}/shop/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticEntries, ...productEntries];
  } catch {
    return staticEntries;
  }
}
