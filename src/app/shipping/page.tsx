import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Dream Star Drivers Club Shipping Policy — domestic and international shipping times, rates, and procedures.",
  openGraph: {
    title: `Shipping Policy | ${BRAND_NAME}`,
    description: "Learn about our shipping times, rates, and procedures for domestic and international orders.",
  },
};

const SECTIONS = [
  {
    id: "processing",
    title: "Order Processing",
    content: (
      <>
        <p>
          All orders are processed within 1–2 business days (Monday through Friday,
          excluding holidays). You will receive an email confirmation with your order
          details immediately after purchase, and a second email with tracking
          information once your order ships.
        </p>
        <p>
          During peak periods (new drops, holidays, sales events), processing may
          take up to 3–4 business days. We appreciate your patience — we&apos;re a
          small team packing each order with care.
        </p>
      </>
    ),
  },
  {
    id: "domestic",
    title: "Domestic Shipping (USA)",
    content: (
      <>
        <p>We ship to all 50 states, plus APO/FPO/DPO addresses.</p>
        <ul>
          <li>
            <strong>Standard Shipping:</strong> 3–7 business days. Free on orders
            over $100. Flat rate of $5.99 for orders under $100.
          </li>
          <li>
            <strong>Expedited Shipping:</strong> 2–3 business days. Calculated at
            checkout based on weight and destination.
          </li>
          <li>
            <strong>Express Shipping:</strong> 1–2 business days. Calculated at
            checkout. Not available for all ZIP codes.
          </li>
        </ul>
        <p>
          Delivery times are estimates and not guaranteed. Weather, carrier delays,
          and peak season volumes may extend delivery times.
        </p>
      </>
    ),
  },
  {
    id: "international",
    title: "International Shipping",
    content: (
      <>
        <p>
          We ship internationally to most countries. Shipping rates are calculated
          at checkout based on destination, weight, and selected service level.
        </p>
        <ul>
          <li>
            <strong>International Standard:</strong> 7–21 business days.
          </li>
          <li>
            <strong>International Expedited:</strong> 5–10 business days.
          </li>
        </ul>
        <p>
          International customers are responsible for all customs duties, taxes,
          tariffs, and import fees imposed by the destination country. These charges
          are not included in the purchase price or shipping cost and are collected
          by the carrier or customs authority upon delivery.
        </p>
        <p>
          Customs policies vary widely by country. We recommend checking with your
          local customs office before ordering to understand potential fees.
        </p>
      </>
    ),
  },
  {
    id: "tracking",
    title: "Order Tracking",
    content: (
      <>
        <p>
          Once your order ships, you&apos;ll receive a shipping confirmation email
          containing your tracking number and a link to track your package. You can
          also track your order through your account dashboard.
        </p>
        <p>
          Tracking information may take 24–48 hours to update after you receive the
          shipping confirmation. If your tracking hasn&apos;t updated within 3 business
          days of receiving the confirmation, contact us at{" "}
          <a href="mailto:dreamstardriversclub@yahoo.com">dreamstardriversclub@yahoo.com</a>.
        </p>
      </>
    ),
  },
  {
    id: "lost-damaged",
    title: "Lost or Damaged Packages",
    content: (
      <>
        <p>
          If your package is lost in transit or arrives damaged, contact us within
          7 days of the expected delivery date (for lost packages) or delivery date
          (for damaged packages):
        </p>
        <ul>
          <li>
            <strong>Lost Packages:</strong> We will file a claim with the carrier and
            either reship your order or issue a refund once the claim is resolved.
          </li>
          <li>
            <strong>Damaged Packages:</strong> Please provide photos of the damaged
            packaging and items. We will arrange a replacement or refund.
          </li>
        </ul>
        <p>
          We are not responsible for packages marked as &quot;delivered&quot; by the
          carrier but not received by you. In such cases, we recommend:
        </p>
        <ul>
          <li>Checking with neighbors, building management, and other household members.</li>
          <li>Contacting the carrier directly with your tracking number.</li>
          <li>Filing a claim with the carrier for stolen packages.</li>
        </ul>
      </>
    ),
  },
  {
    id: "address-errors",
    title: "Incorrect Addresses",
    content: (
      <>
        <p>
          Please double-check your shipping address before placing your order. If
          you realize there&apos;s an error, contact us immediately at{" "}
          <a href="mailto:dreamstardriversclub@yahoo.com">dreamstardriversclub@yahoo.com</a> with your
          order number and the correct address. We&apos;ll do our best to update it
          before the order ships.
        </p>
        <p>
          If an order has already shipped with an incorrect address, we are not
          responsible for the loss. The package may be returned to us by the carrier;
          if so, we will contact you to arrange reshipment at your expense.
        </p>
      </>
    ),
  },
  {
    id: "restricted-items",
    title: "Restricted Items & Destinations",
    content: (
      <>
        <p>
          Certain DS Performance parts may be subject to shipping restrictions based
          on local regulations. If an item in your order cannot be shipped to your
          destination, we will notify you and cancel that item with a full refund.
        </p>
        <p>
          We currently ship to most countries, but some destinations may be excluded
          due to shipping carrier limitations or regulatory restrictions. You will
          be notified at checkout if your destination is not supported.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Shipping Questions",
    content: (
      <>
        <p>
          For any shipping-related questions, reach out to us at{" "}
          <a href="mailto:dreamstardriversclub@yahoo.com">dreamstardriversclub@yahoo.com</a>. Include
          your order number for faster assistance.
        </p>
      </>
    ),
  },
];

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      description="Everything you need to know about shipping — processing times, domestic and international rates, tracking, and more."
      lastUpdated="July 15, 2026"
      sections={SECTIONS}
    />
  );
}
