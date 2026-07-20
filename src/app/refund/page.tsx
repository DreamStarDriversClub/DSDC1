import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Dream Star Drivers Club Refund Policy — how refunds are processed, timelines, and eligibility.",
  openGraph: {
    title: `Refund Policy | ${BRAND_NAME}`,
    description: "Learn about our refund process, timelines, and eligibility.",
  },
};

const SECTIONS = [
  {
    id: "refund-eligibility",
    title: "Refund Eligibility",
    content: (
      <>
        <p>
          Refunds are issued once we receive and inspect your returned item. For a
          refund to be approved, items must meet the conditions outlined in our{" "}
          <a href="/returns">Return Policy</a>:
        </p>
        <ul>
          <li>Apparel: Unworn, unwashed, with original tags attached.</li>
          <li>Accessories: Unopened and in original packaging.</li>
          <li>Performance Parts: Unopened and in original packaging. Opened or installed parts are not eligible unless defective.</li>
          <li>Return must be initiated within 30 days of delivery.</li>
        </ul>
      </>
    ),
  },
  {
    id: "refund-process",
    title: "Refund Process",
    content: (
      <>
        <p>
          Here&apos;s how the refund process works:
        </p>
        <ol className="mb-3 list-decimal space-y-1 pl-5">
          <li>Initiate a return through your account or by contacting us.</li>
          <li>Ship the item back using the provided return label (if applicable).</li>
          <li>
            Once we receive the item, our team inspects it within 2–3 business days.
          </li>
          <li>
            If approved, the refund is processed within 5–7 business days to your
            original payment method.
          </li>
          <li>
            You&apos;ll receive an email confirmation when your refund is initiated.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: "refund-amount",
    title: "Refund Amount",
    content: (
      <>
        <p>
          Refunds include the purchase price of the returned item(s) plus applicable
          sales tax.
        </p>
        <ul>
          <li>
            <strong>Original shipping charges</strong> are non-refundable unless the
            return is due to our error (wrong item, defective product).
          </li>
          <li>
            <strong>Return shipping costs</strong> may be deducted from your refund
            if a prepaid return label is used, unless the return is due to our error.
          </li>
          <li>
            If you used a discount code on the original order and return part of the
            order, the discount may be recalculated based on the items kept.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "refund-timeline",
    title: "Refund Timeline",
    content: (
      <>
        <p>
          Once your refund is processed by us, the time it takes to appear in your
          account depends on your payment method:
        </p>
        <ul>
          <li>
            <strong>Credit/Debit Cards:</strong> 2–5 business days after processing.
          </li>
          <li>
            <strong>PayPal:</strong> Typically within 24 hours of processing.
          </li>
          <li>
            <strong>Apple Pay / Google Pay:</strong> 2–5 business days after processing.
          </li>
        </ul>
        <p>
          If you haven&apos;t received your refund 10 business days after receiving
          the confirmation email, contact your bank or card issuer first, then reach
          out to us if the issue persists.
        </p>
      </>
    ),
  },
  {
    id: "non-refundable",
    title: "Non-Refundable Items",
    content: (
      <>
        <p>The following items are not eligible for refund:</p>
        <ul>
          <li>Gift cards and digital products.</li>
          <li>Items marked as &quot;Final Sale&quot; or &quot;Clearance.&quot;</li>
          <li>Opened or installed performance parts (unless defective).</li>
          <li>Custom or personalized items.</li>
          <li>Items returned more than 30 days after delivery.</li>
          <li>Items showing signs of use, wear, or damage not present at delivery.</li>
        </ul>
      </>
    ),
  },
  {
    id: "defective-items",
    title: "Defective or Damaged Items",
    content: (
      <>
        <p>
          If you receive a defective or damaged product, contact us within 7 days of
          delivery at{" "}
          <a href="mailto:hello@dreamstardc.com">hello@dreamstardc.com</a> with:
        </p>
        <ul>
          <li>Your order number.</li>
          <li>A description of the defect or damage.</li>
          <li>Clear photos showing the issue.</li>
        </ul>
        <p>
          We will arrange a replacement or full refund, including shipping costs,
          at no charge to you. We may request return of the defective item for
          quality control purposes.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Questions About Refunds",
    content: (
      <>
        <p>
          For refund-related questions, contact us at{" "}
          <a href="mailto:hello@dreamstardc.com">hello@dreamstardc.com</a>. Please
          include your order number for faster service.
        </p>
      </>
    ),
  },
];

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      description="We want you to be satisfied with your purchase. Here's everything you need to know about our refund process."
      lastUpdated="July 15, 2026"
      sections={SECTIONS}
    />
  );
}
