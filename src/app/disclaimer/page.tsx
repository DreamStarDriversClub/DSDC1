import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Dream Star Drivers Club Disclaimer — important information about performance parts, off-road use, and liability limitations.",
  openGraph: {
    title: `Disclaimer | ${BRAND_NAME}`,
    description: "Important disclaimers regarding our performance parts, vehicle warranties, and product usage.",
  },
};

const SECTIONS = [
  {
    id: "general",
    title: "General Disclaimer",
    content: (
      <>
        <p>
          The products sold by Dream Star Drivers Club — particularly DS Performance
          parts — are intended for use by knowledgeable automotive enthusiasts. By
          purchasing and using our products, you acknowledge and accept the risks
          associated with modifying your vehicle.
        </p>
        <p>
          Dream Star Drivers Club provides products on an &quot;as is&quot; basis.
          While we take pride in the quality and craftsmanship of everything we sell,
          we make no guarantees or warranties — express or implied — regarding the
          suitability, safety, or performance of our products for your specific
          application.
        </p>
      </>
    ),
  },
  {
    id: "off-road",
    title: "Off-Road & Racing Use",
    content: (
      <>
        <p>
          Many DS Performance parts are designed for <strong>off-road and racing
          applications only</strong> and may not comply with federal, state, or
          local emissions regulations. Installation of such parts on vehicles
          operated on public roads may violate applicable laws.
        </p>
        <p>
          It is the sole responsibility of the purchaser and installer to ensure
          that any modifications made to a vehicle comply with all applicable laws
          and regulations in their jurisdiction. Dream Star Drivers Club assumes
          no liability for violations resulting from the use of our products on
          public roads.
        </p>
      </>
    ),
  },
  {
    id: "vehicle-warranty",
    title: "Vehicle Warranty Implications",
    content: (
      <>
        <p>
          Installing aftermarket performance parts — including DS Performance
          products — may void or affect your vehicle&apos;s manufacturer warranty.
          Under the Magnuson-Moss Warranty Act, a manufacturer cannot void a
          warranty simply because aftermarket parts are present, but they may deny
          coverage for failures they can prove were caused by the aftermarket part.
        </p>
        <p>
          We recommend consulting your vehicle manufacturer, dealership, and a
          qualified mechanic before installing performance modifications. Dream
          Star Drivers Club is not responsible for voided warranties, denied claims,
          or repair costs related to the installation or use of our products.
        </p>
      </>
    ),
  },
  {
    id: "installation",
    title: "Installation & Professional Guidance",
    content: (
      <>
        <p>
          Performance parts — especially engine components — require precision
          installation. Improper installation can result in engine damage, vehicle
          failure, personal injury, or worse. We strongly recommend that all DS
          Performance parts be installed by a qualified, experienced professional
          familiar with rotary engines, 2JZ engines, and performance modification.
        </p>
        <p>
          Dream Star Drivers Club provides installation guidance and documentation
          as a courtesy. These materials are not a substitute for professional
          expertise. We assume no liability for damage resulting from installation
          errors, misuse, or modifications made to our products after purchase.
        </p>
      </>
    ),
  },
  {
    id: "product-compatibility",
    title: "Product Compatibility",
    content: (
      <>
        <p>
          We strive to provide accurate fitment information for all DS Performance
          products. However, vehicle variations, prior modifications, and wear can
          affect compatibility. It is the buyer&apos;s responsibility to verify
          compatibility before purchase and installation.
        </p>
        <p>
          If you are unsure about fitment for your specific vehicle, contact us at{" "}
          <a href="mailto:dreamstardriversclub@yahoo.com">dreamstardriversclub@yahoo.com</a> before
          ordering. We&apos;re happy to help, but we cannot guarantee compatibility
          in all cases.
        </p>
      </>
    ),
  },
  {
    id: "safety",
    title: "Safety Warnings",
    content: (
      <>
        <p>
          Motorsports and vehicular modifications are inherently dangerous
          activities. By purchasing and using DS Performance products, you
          acknowledge and accept these risks. Always prioritize safety:
        </p>
        <ul>
          <li>Use appropriate safety equipment when working on vehicles.</li>
          <li>Follow all installation instructions carefully.</li>
          <li>Have work inspected by a qualified professional when in doubt.</li>
          <li>Never operate a vehicle that is unsafe or improperly modified.</li>
          <li>Comply with all track and event safety regulations.</li>
        </ul>
        <p>
          Dream Star Drivers Club is not liable for any injury, death, property
          damage, or consequential loss resulting from the use or misuse of our
          products.
        </p>
      </>
    ),
  },
  {
    id: "accuracy",
    title: "Website Content Accuracy",
    content: (
      <>
        <p>
          We make every effort to ensure the information on our website is accurate
          and up to date. However, we do not warrant that product descriptions,
          pricing, images, specifications, or other content is error-free. In the
          event of an error, we reserve the right to correct it and to cancel or
          refuse orders affected by the error.
        </p>
        <p>
          Product images are for illustration purposes. Actual products may vary
          slightly from images due to monitor settings, manufacturing tolerances,
          and product revisions.
        </p>
      </>
    ),
  },
  {
    id: "external-links",
    title: "External Links",
    content: (
      <>
        <p>
          Our website may contain links to third-party websites and resources. We
          provide these links for convenience only and do not endorse, control, or
          assume responsibility for the content, products, or services offered by
          those third parties. Your use of third-party websites is at your own
          risk.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>
          If you have questions about this disclaimer or our products, contact us at{" "}
          <a href="mailto:dreamstardriversclub@yahoo.com">dreamstardriversclub@yahoo.com</a>.
        </p>
      </>
    ),
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="Important information about performance parts, vehicle modifications, and the proper use of Dream Star Drivers Club products."
      lastUpdated="July 15, 2026"
      sections={SECTIONS}
    />
  );
}
