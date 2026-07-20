import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "./FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Find answers to frequently asked questions about Dream Star Drivers Club — shipping, returns, sizing, orders, and more.",
  openGraph: {
    title: `FAQ | ${BRAND_NAME}`,
    description:
      "Got questions? We've got answers. Browse our FAQ for shipping, returns, sizing, and more.",
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqCategory[] = [
  {
    id: "shipping",
    title: "Shipping",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Domestic orders (USA) typically arrive within 3–7 business days. International orders take 7–21 business days depending on destination and customs processing. All orders are processed within 1–2 business days. You'll receive tracking information as soon as your order ships.",
      },
      {
        question: "What are your shipping rates?",
        answer:
          "We offer free standard shipping on all domestic orders over $100. For orders under $100, shipping is calculated at checkout based on weight and destination. Expedited shipping options are available for an additional fee. International shipping rates vary and are calculated at checkout.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes! We ship to most countries worldwide. International customers are responsible for any customs duties, taxes, or import fees that may apply. These charges are not included in the purchase price or shipping cost. We recommend checking with your local customs office before ordering.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive a confirmation email with a tracking number. You can track your package anytime using that number on our carrier's website. If you haven't received tracking info within 3 business days of placing your order, check your spam folder or contact us at hello@dreamstardc.com.",
      },
    ],
  },
  {
    id: "orders",
    title: "Orders & Payments",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are processed securely via encrypted connections. We do not store your full credit card information on our servers.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "Orders can be modified or cancelled within 1 hour of placement. After that, our fulfillment team may have already begun processing your order. Contact us immediately at hello@dreamstardc.com with your order number if you need to make changes. We'll do our best to accommodate, but we cannot guarantee modifications after the 1-hour window.",
      },
      {
        question: "An item I want is out of stock. When will it be back?",
        answer:
          "Our limited drops sell out quickly — it's the nature of the club. Sign up for our newsletter and follow us on social media to be the first to know about restocks and new releases. For DS Performance parts, most items are restocked within 2–4 weeks. You can also use the 'Notify Me' button on out-of-stock product pages.",
      },
    ],
  },
  {
    id: "products",
    title: "Products & Sizing",
    items: [
      {
        question: "How does your apparel sizing run?",
        answer:
          "Our apparel runs true to size with a modern, slightly tailored fit. If you prefer an oversized look, we recommend sizing up. Each product page includes a detailed size chart with measurements. In general: tees are a midweight cotton with minimal shrinkage, and hoodies are a relaxed athletic fit. Still unsure? Reach out and we'll help you find the right size.",
      },
      {
        question: "Do DS Performance parts come with a warranty?",
        answer:
          "Yes. All DS Performance parts are backed by our 90-day warranty against manufacturing defects. This covers materials and workmanship under normal use conditions. The warranty does not cover damage from improper installation, misuse, or modifications. Keep your order confirmation as proof of purchase. If you experience an issue, contact us with photos and a description.",
      },
      {
        question: "Are your performance parts genuine and tested?",
        answer:
          "Absolutely. Every DS Performance part is designed, manufactured, and tested to meet or exceed OEM specifications. We run our own cars hard — if a part isn't good enough for our builds, it's not good enough for yours. All rotary components undergo QC inspection before shipping. Quality isn't a feature; it's the baseline.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "We accept returns on unworn, unwashed apparel and unopened accessories within 30 days of delivery. Items must be in original condition with tags attached. DS Performance parts may be returned within 30 days if unopened and in original packaging. Opened or installed parts are not eligible for return unless defective. See our full Return Policy for details.",
      },
      {
        question: "How do exchanges work?",
        answer:
          "To exchange an item, initiate a return through our Returns page and place a new order for the item you want. This is the fastest way to get the right product in your hands. We'll process your return refund once we receive and inspect the original item. If you need help with sizing before re-ordering, just reach out.",
      },
      {
        question: "When will I receive my refund?",
        answer:
          "Refunds are processed within 5–7 business days after we receive and inspect your returned item. The refund goes back to your original payment method. Depending on your bank or card issuer, it may take an additional 2–5 business days for the credit to appear on your statement. You'll receive an email confirmation when your refund is initiated.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Community",
    items: [
      {
        question: "What are the benefits of creating an account?",
        answer:
          "Creating an account gives you faster checkout, order history tracking, saved addresses, and exclusive early access to new drops. Hoshi Club members (coming soon) will earn points on purchases, get birthday rewards, and unlock member-only products. It's free — and it makes your experience smoother every time you shop.",
      },
      {
        question: "How do I join the Hoshi Club loyalty program?",
        answer:
          "Hoshi Club is our upcoming loyalty program. All account holders will be automatically enrolled when it launches. You'll earn points on every purchase, which can be redeemed for discounts, exclusive merch, and event access. Stay tuned — we'll announce the launch via email and social media.",
      },
      {
        question: "Do you host events or meetups?",
        answer:
          "Yes! We host Cars & Coffee meetups, track days, and club gatherings throughout the year. Locations and dates are announced on our social channels and via the newsletter. We're always looking for new spots — if you want us to come to your area, let us know! The club is strongest when we're together.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <Container className="relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center opacity-start animate-fade-in-up">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              Got Questions?
            </span>
            <h1 className="mt-4 font-display text-display-lg text-ds-white">
              Frequently Asked{" "}
              <span className="text-ds-red">Questions</span>
            </h1>
            <div className="mx-auto mt-6 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ds-gray-400">
              Everything you need to know about orders, shipping, returns, and
              the club. Can&apos;t find what you&apos;re looking for?{" "}
              <a
                href="/contact"
                className="text-ds-red underline underline-offset-2 transition-colors hover:text-ds-red-400"
              >
                Reach out
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* ── FAQ Content ─────────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <div className="mx-auto max-w-3xl">
            <FaqAccordion categories={FAQ_DATA} />
          </div>
        </Container>
      </section>

      {/* ── Still Have Questions? ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <Container className="relative py-16 text-center sm:py-20">
          <h2 className="font-display text-2xl font-black tracking-tight text-ds-white sm:text-3xl">
            Still Have Questions?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ds-gray-400">
            Our crew is standing by. Drop us a message and we&apos;ll get back
            to you within 24 hours.
          </p>
          <div className="mt-6">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ds-red px-8 py-4 text-base font-semibold text-white shadow-brand-glow-sm transition-all duration-300 hover:bg-ds-red-700 hover:shadow-brand-glow active:scale-[0.97]"
            >
              Contact Us
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </Container>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
      </section>
    </>
  );
}
