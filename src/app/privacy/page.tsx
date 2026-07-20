import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Dream Star Drivers Club Privacy Policy — how we collect, use, and protect your personal information.",
  openGraph: {
    title: `Privacy Policy | ${BRAND_NAME}`,
    description: "Read our privacy policy to understand how we handle your data.",
  },
};

const SECTIONS = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: (
      <>
        <p>
          When you interact with Dream Star Drivers Club, we may collect the following
          types of information:
        </p>
        <p>
          <strong>Personal Information:</strong> Name, email address, shipping address,
          billing address, phone number, and payment details when you place an order
          or create an account. Payment information (credit card numbers) is processed
          securely by our payment partners and is never stored on our servers.
        </p>
        <p>
          <strong>Automatically Collected Information:</strong> When you visit our
          website, we automatically collect certain data including your IP address,
          browser type, device information, pages visited, time spent on pages, and
          referring URLs. This is done via cookies and similar technologies.
        </p>
        <p>
          <strong>Account Information:</strong> If you create an account, we store your
          login credentials (password is hashed and encrypted), order history, saved
          addresses, and preferences.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>Processing and fulfilling your orders, including shipping and returns.</li>
          <li>
            Communicating with you about your orders, account, and customer support
            inquiries.
          </li>
          <li>
            Sending marketing communications (newsletters, new drops, promotions) if
            you have opted in. You can unsubscribe at any time.
          </li>
          <li>
            Improving our website, products, and customer experience based on usage
            patterns and feedback.
          </li>
          <li>Preventing fraud, protecting our legal rights, and ensuring site security.</li>
          <li>Complying with applicable laws and regulations.</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing-disclosure",
    title: "How We Share Your Information",
    content: (
      <>
        <p>
          We do not sell, rent, or trade your personal information to third parties.
          We may share data in the following limited circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> We share necessary information with
            trusted third-party partners who help us operate (payment processors,
            shipping carriers, email platforms, analytics). These partners are
            contractually obligated to protect your data.
          </li>
          <li>
            <strong>Legal Compliance:</strong> We may disclose information if required
            by law, court order, or to protect our rights or the safety of others.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger, acquisition,
            or sale of assets, your information may be transferred as part of that
            transaction with appropriate notice.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Tracking Technologies",
    content: (
      <>
        <p>
          We use cookies and similar tracking technologies to enhance your browsing
          experience, analyze site traffic, and deliver personalized content. Types
          of cookies we use include:
        </p>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Required for site functionality
            (shopping cart, checkout, account login).
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how visitors
            use our site (Google Analytics).
          </li>
          <li>
            <strong>Marketing Cookies:</strong> Used to deliver relevant ads and
            measure campaign performance.
          </li>
        </ul>
        <p>
          You can control cookie preferences through your browser settings. Disabling
          certain cookies may affect site functionality. See our{" "}
          <a href="/cookies">Cookie Policy</a> for more details.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "Data Security",
    content: (
      <>
        <p>
          We implement industry-standard security measures to protect your personal
          information, including:
        </p>
        <ul>
          <li>SSL/TLS encryption for all data transmitted to and from our site.</li>
          <li>Encrypted storage of sensitive data.</li>
          <li>Regular security audits and vulnerability assessments.</li>
          <li>Access controls limiting employee access to personal data.</li>
        </ul>
        <p>
          While we take reasonable precautions, no method of electronic transmission
          or storage is 100% secure. We cannot guarantee absolute security of your
          data.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights & Choices",
    content: (
      <>
        <p>Depending on your jurisdiction, you may have the following rights:</p>
        <ul>
          <li>
            <strong>Access:</strong> Request a copy of the personal data we hold
            about you.
          </li>
          <li>
            <strong>Correction:</strong> Request that we correct inaccurate or
            incomplete data.
          </li>
          <li>
            <strong>Deletion:</strong> Request that we delete your personal data,
            subject to legal retention requirements.
          </li>
          <li>
            <strong>Opt-Out:</strong> Unsubscribe from marketing emails at any
            time using the link in each email, or contact us directly.
          </li>
          <li>
            <strong>Data Portability:</strong> Request your data in a structured,
            commonly used format.
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:hello@dreamstardc.com">hello@dreamstardc.com</a>.
          We will respond to your request within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    content: (
      <>
        <p>
          Our website is not directed at individuals under the age of 16. We do not
          knowingly collect personal information from children. If we become aware
          that a child under 16 has provided us with personal data, we will take steps
          to delete such information promptly. If you believe a child has provided
          us with personal information, please contact us immediately.
        </p>
      </>
    ),
  },
  {
    id: "policy-changes",
    title: "Changes To This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted
          on this page with an updated &quot;Last Updated&quot; date. Material changes
          will be communicated via email to account holders. Your continued use of
          the site after changes are posted constitutes acceptance of the updated
          policy.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy or our data practices,
          please contact us:
        </p>
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

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Your privacy matters. This policy explains how Dream Star Drivers Club collects, uses, and protects your personal information."
      lastUpdated="July 15, 2026"
      sections={SECTIONS}
    />
  );
}
