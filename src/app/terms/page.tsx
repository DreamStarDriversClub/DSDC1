import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Dream Star Drivers Club Terms of Service — rules and guidelines for using our website and purchasing our products.",
  openGraph: {
    title: `Terms of Service | ${BRAND_NAME}`,
    description: "Read our terms of service before using our site or making a purchase.",
  },
};

const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing or using the Dream Star Drivers Club website (dreamstardriversclub.com),
          placing an order, or creating an account, you agree to be bound by these Terms of
          Service. If you do not agree with any part of these terms, please do not use
          our website or services.
        </p>
        <p>
          These terms apply to all visitors, registered users, customers, and any other
          person accessing our site. We reserve the right to update these terms at any time.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility",
    content: (
      <>
        <p>
          You must be at least 18 years old (or the age of majority in your jurisdiction)
          to create an account or place an order on our website. By using this site, you
          represent and warrant that you meet this age requirement.
        </p>
        <p>
          If you are under 18, you may use the site only with the involvement and consent
          of a parent or legal guardian.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Account Responsibilities",
    content: (
      <>
        <p>
          When you create an account with Dream Star Drivers Club, you agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete account information.</li>
          <li>Maintain and update your account information as needed.</li>
          <li>
            Keep your password confidential and not share it with others. You are
            responsible for all activity under your account.
          </li>
          <li>
            Notify us immediately of any unauthorized use of your account or
            security breach.
          </li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate these
          terms or engage in fraudulent or abusive behavior.
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "Orders & Pricing",
    content: (
      <>
        <p>
          All prices are listed in United States Dollars (USD) and are subject to
          change without notice. We strive to display accurate pricing, but errors
          may occur. If we discover an error in pricing for an item you ordered, we
          will notify you and give you the option to proceed at the correct price
          or cancel.
        </p>
        <p>
          We reserve the right to refuse or cancel any order for any reason,
          including suspected fraud, inventory errors, or pricing mistakes. If your
          order is cancelled after payment, a full refund will be issued.
        </p>
        <p>
          Product availability is not guaranteed. Items may sell out quickly.
          Placing an item in your cart does not reserve it.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payment Terms",
    content: (
      <>
        <p>
          Payment is due at the time of purchase. We accept the payment methods
          displayed at checkout. By providing payment information, you represent
          that you are authorized to use that payment method.
        </p>
        <p>
          All payments are processed securely through third-party payment processors.
          We do not store full credit card numbers on our servers. You are responsible
          for any fees, taxes, or currency conversion charges imposed by your bank
          or card issuer.
        </p>
      </>
    ),
  },
  {
    id: "shipping-and-returns",
    title: "Shipping & Returns",
    content: (
      <>
        <p>
          Shipping and delivery terms are outlined in our{" "}
          <a href="/shipping">Shipping Policy</a>. Returns and exchanges are governed
          by our <a href="/returns">Return Policy</a>. By placing an order, you
          acknowledge that you have read and agree to these policies.
        </p>
        <p>
          International customers are responsible for all customs duties, taxes, and
          import fees. We are not responsible for delays caused by customs
          processing.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          All content on this website — including but not limited to designs, logos,
          graphics, product images, text, trademarks, and the &quot;Dream Star Drivers
          Club&quot; name — is the exclusive property of Dream Star Drivers Club and
          is protected by copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You may not reproduce, distribute, modify, create derivative works from,
          publicly display, or otherwise use any content from this site without our
          prior written permission. Unauthorized use may result in legal action.
        </p>
      </>
    ),
  },
  {
    id: "user-content",
    title: "User-Generated Content",
    content: (
      <>
        <p>
          By submitting content to us — including product reviews, photos, comments,
          or social media tags — you grant Dream Star Drivers Club a non-exclusive,
          royalty-free, worldwide, perpetual license to use, reproduce, modify, and
          display that content for marketing and promotional purposes.
        </p>
        <p>
          You represent that you own or have the right to submit the content, and
          that it does not infringe on any third-party rights. We reserve the right
          to remove any user content at our discretion.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer of Warranties",
    content: (
      <>
        <p>
          Our products and website are provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind, either express or implied. We do not warrant
          that the site will be uninterrupted, error-free, or free of harmful components.
        </p>
        <p>
          Performance parts are intended for off-road and racing use only unless
          otherwise specified. Installation of performance parts may affect vehicle
          warranties and emissions compliance. See our{" "}
          <a href="/disclaimer">Disclaimer</a> for more details.
        </p>
      </>
    ),
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by law, Dream Star Drivers Club shall not
          be liable for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of our website, products, or services.
        </p>
        <p>
          Our total liability for any claim related to a product purchase is limited
          to the purchase price of that product. This limitation applies regardless
          of the legal theory on which the claim is based.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    content: (
      <>
        <p>
          We reserve the right to terminate or suspend your account and access to our
          services at our sole discretion, without prior notice, for conduct that we
          believe violates these terms or is harmful to us, other users, or third
          parties.
        </p>
        <p>
          Upon termination, your right to use our site and services will immediately
          cease. Provisions that by their nature should survive termination (including
          intellectual property rights, disclaimers, and limitations of liability)
          shall remain in effect.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: (
      <>
        <p>
          These Terms of Service shall be governed by and construed in accordance
          with the laws of the State of Delaware, United States of America, without
          regard to its conflict of law provisions. Any disputes arising from these
          terms shall be resolved in the courts of Delaware.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Information",
    content: (
      <>
        <p>For questions about these Terms of Service, contact us at:</p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:hello@dreamstardc.com">hello@dreamstardc.com</a>
        </p>
        <p>
          Dream Star Drivers Club
          <br />
          United States of America
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These terms govern your use of the Dream Star Drivers Club website and your purchase of our products. Please read them carefully."
      lastUpdated="July 15, 2026"
      sections={SECTIONS}
    />
  );
}
