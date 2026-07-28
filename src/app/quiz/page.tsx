import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { QuizEngine } from "@/components/quiz/QuizEngine";

export const metadata: Metadata = {
  title: "What's Your Build? — Quiz | Dream Star Drivers Club",
  description:
    "Take our interactive quiz to discover your JDM personality and find the perfect Dream Star gear for your build. Rotary, 2JZ, touge runs, and more.",
  openGraph: {
    title: `What's Your Build? — Quiz | ${BRAND_NAME}`,
    description:
      "Discover your JDM build archetype and find the perfect Dream Star gear.",
  },
};

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  // Fetch products for recommendations (active, database products)
  let products: {
    slug: string;
    name: string;
    price: number;
    image: string | null;
    category: string;
  }[] = [];

  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        name: true,
        price: true,
        images: true,
        category: { select: { slug: true } },
      },
      take: 30,
      orderBy: { createdAt: "desc" },
    });

    products = dbProducts.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: parseFloat(p.price.toString()),
      image: Array.isArray(p.images) && p.images.length > 0 ? (p.images[0] as string) : null,
      category: p.category.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch products for quiz:", error);
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 z-0 bg-grid" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-hero-glow" />
        <Container className="relative z-10 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ds-red/20 bg-ds-red/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-ds-red">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              Interactive Quiz
            </span>

            <h1 className="mt-6 font-display text-display-lg text-ds-white">
              What&apos;s Your Build?
            </h1>

            <div className="mx-auto mt-6 h-[3px] w-12 rounded-full bg-ds-red" />

            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-ds-gray-300">
              Answer 5 questions to discover your JDM personality and unlock the
              perfect Dream Star gear for your build.
            </p>
          </div>
        </Container>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
      </section>

      {/* ── Quiz Engine ───────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <QuizEngine products={products} />
        </Container>
      </section>
    </>
  );
}
