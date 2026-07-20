import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Return Policy",
  description:
    "Dream Star Drivers Club Return Policy — how to return items, eligibility, and step-by-step instructions.",
  openGraph: {
    title: `Return Policy | ${BRAND_NAME}`,
    description: "Learn how to return items, check eligibility, and start a return.",
  },
};

const SECTIONS = [
  {
    id: "return-window",
    title: "Return Window",
    content: (
      <>
        <p>
          We accept returns within <strong>30 days</strong> of the delivery date.
          If 30 days have passed since your order was delivered, unfortunately we
          cannot offer a return or exchange.
        </p>
        <p>
          To be eligible for a return, items must be in the same condition you
          received them — unworn or unused, with tags attached, and in original
          packaging where applicable.
        </p>
      </>
    ),
  },
  {
    id: "how-to-return",
    title: "How to Start a Return",
    content: (
      <>
        <p>Follow these steps to return an item:</p>
        <ol className="mb-3 list-decimal space-y-1 pl-5">
          <li>
            <strong>Initiate:</strong> Log into your account and go to your order
            history, or contact us at{" "}
            <a href="mailto:returns@dreamstardc.com">returns@dreamstardc.com</a>{" "}
            with your order number.
          </li>
          <li>
            <strong>Approval:</strong> We&apos;ll review your request within 1–2
            business days and send return instructions.
          </li>
          <li>
            <strong>Pack:</strong> Securely pack the item in its original packaging
            (or equivalent protection). Include all tags, accessories, and
            documentation.
          </li>
          <li>
            <strong>Ship:</strong> Use the provided return label or ship to the
            address we provide. Keep your tracking number.
          </li>
          <li>
            <strong>Refund:</strong> Once we receive and inspect the item (2–3
            business days), your refund will be processed. See our{" "}
            <a href="/refund">Refund Policy</a> for details.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: "return-conditions",
    title: "Return Conditions by Product Type",
    content: (
      <>
        <div className="mb-4 space-y-3">
          <div>
            <strong className="text-ds-white">Apparel:</strong>
            <p>Must be unworn, unwashed, and with all original tags attached. Items
            with deodorant marks, perfume scents, or signs of wear will not be accepted.</p>
          </div>
          <div>
            <strong className="text-ds-white">Accessories:</strong>
            <p>Must be unopened and in original packaging. Opened stickers, decals, or
            other consumable accessories cannot be returned.</p>
          </div>
          <div>
            <strong className="text-ds-white">DS Performance Parts:</strong>
            <p>Must be unopened, in original packaging, and in resalable condition.
            Opened, installed, or modified parts are not eligible for return unless
            found to be defective upon inspection.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "exchanges",
    title: "Exchanges",
    content: (
      <>
        <p>
          For the fastest exchange, we recommend initiating a return for the item
          you don&apos;t want and placing a new order for the correct item. This
          ensures you get the right product quickly without waiting for return
          processing.
        </p>
        <p>
          If you need help with sizing or product selection before re-ordering,
          our team is happy to assist — contact us at{" "}
          <a href="mailto:hello@dreamstardc.com">hello@dreamstardc.com</a>.
        </p>
        <p>
          For defective items, we handle exchanges directly. Contact us with photos
          and your order number, and we&apos;ll ship a replacement at no cost.
        </p>
      </>
    ),
  },
  {
    id: "return-shipping",
    title: "Return Shipping Costs",
    content: (
      <>
        <p>
          Return shipping costs depend on the reason for your return:
        </p>
        <ul>
          <li>
            <strong>Changed your mind / wrong size:</strong> You are responsible for
            return shipping. We can provide a prepaid label with the cost deducted
            from your refund.
          </li>
          <li>
            <strong>Our error (wrong item, defective):</strong> We cover return
            shipping and provide a prepaid label at no cost.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "non-returnable",
    title: "Non-Returnable Items",
    content: (
      <>
        <p>The following items cannot be returned:</p>
        <ul>
          <li>Gift cards.</li>
          <li>Items marked &quot;Final Sale&quot; or &quot;Clearance.&quot;</li>
          <li>Opened or installed performance parts (unless defective).</li>
          <li>Custom or personalized products.</li>
          <li>Items returned more than 30 days after delivery.</li>
          <li>Items not in original condition (worn, washed, damaged after delivery).</li>
        </ul>
      </>
    ),
  },
  {
    id: "contact",
    title: "Return Questions",
    content: (
      <>
        <p>
          For return inquiries, contact us at{" "}
          <a href="mailto:returns@dreamstardc.com">returns@dreamstardc.com</a>.
          Please include your order number and a brief description. We respond to
          all return requests within 1–2 business days.
        </p>
      </>
    ),
  },
];

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Return Policy"
      description="We stand behind our products. If something isn't right, here's how to return or exchange your order."
      lastUpdated="July 15, 2026"
      sections={SECTIONS}
    />
  );
}
