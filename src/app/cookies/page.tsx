import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Dream Star Drivers Club Cookie Policy — how we use cookies and tracking technologies on our website.",
  openGraph: {
    title: `Cookie Policy | ${BRAND_NAME}`,
    description: "Learn about how we use cookies and similar tracking technologies on our site.",
  },
};

const SECTIONS = [
  {
    id: "what-are-cookies",
    title: "What Are Cookies",
    content: (
      <>
        <p>
          Cookies are small text files placed on your device (computer, phone, or
          tablet) when you visit a website. They are widely used to make websites
          work, improve user experience, and provide information to site owners. Cookies
          may be &quot;session&quot; (temporary, deleted when you close your browser)
          or &quot;persistent&quot; (remain until they expire or you delete them).
        </p>
        <p>
          In addition to cookies, we may use similar technologies such as web beacons,
          pixels, and local storage to collect and store information.
        </p>
      </>
    ),
  },
  {
    id: "cookies-we-use",
    title: "Types of Cookies We Use",
    content: (
      <>
        <p>We use the following categories of cookies on our website:</p>
        <div className="mb-4 space-y-3">
          <div>
            <strong className="text-ds-white">Essential Cookies</strong>
            <p>
              These are necessary for the website to function properly. They enable
              core features like secure login, shopping cart functionality, and
              checkout. The site cannot operate properly without these cookies.
            </p>
          </div>
          <div>
            <strong className="text-ds-white">Performance & Analytics Cookies</strong>
            <p>
              These help us understand how visitors interact with our site — which
              pages are most popular, how people navigate, and where improvements are
              needed. We use Google Analytics and similar tools. All data is
              aggregated and anonymized.
            </p>
          </div>
          <div>
            <strong className="text-ds-white">Functional Cookies</strong>
            <p>
              These enable enhanced features like remembering your preferences
              (language, region, saved cart items) and providing personalized
              content. Disabling these may reduce site functionality.
            </p>
          </div>
          <div>
            <strong className="text-ds-white">Marketing & Advertising Cookies</strong>
            <p>
              These track your browsing habits to deliver relevant ads on other
              platforms (social media, search engines) and measure campaign
              effectiveness. We use these to show you products you might be
              interested in.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Cookies",
    content: (
      <>
        <p>
          Some cookies on our site are placed by trusted third-party services we
          use, including:
        </p>
        <ul>
          <li>
            <strong>Google Analytics:</strong> For website analytics and performance
            measurement.{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Meta (Facebook/Instagram):</strong> For advertising, conversion
            tracking, and audience building.
          </li>
          <li>
            <strong>Stripe / PayPal:</strong> For secure payment processing.
          </li>
          <li>
            <strong>Shopify Analytics:</strong> For e-commerce analytics and
            performance.
          </li>
        </ul>
        <p>
          These third parties may use their own cookies and have their own privacy
          policies. We do not control these third-party cookies.
        </p>
      </>
    ),
  },
  {
    id: "managing-cookies",
    title: "Managing Your Cookie Preferences",
    content: (
      <>
        <p>You have several options for managing cookies:</p>
        <ul>
          <li>
            <strong>Browser Settings:</strong> Most browsers allow you to view,
            delete, and block cookies. Check your browser&apos;s help section for
            instructions. Note that blocking all cookies may break site functionality.
          </li>
          <li>
            <strong>Cookie Consent Banner:</strong> When you first visit our site,
            you may see a cookie consent banner allowing you to accept or customize
            your preferences for non-essential cookies.
          </li>
          <li>
            <strong>Google Analytics Opt-Out:</strong> You can opt out of Google
            Analytics tracking by installing the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-Out Browser Add-on
            </a>
            .
          </li>
          <li>
            <strong>Ad Choice:</strong> Visit{" "}
            <a
              href="https://optout.aboutads.info"
              target="_blank"
              rel="noopener noreferrer"
            >
              AboutAds.info
            </a>{" "}
            or{" "}
            <a
              href="https://www.youronlinechoices.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Your Online Choices
            </a>{" "}
            to opt out of targeted advertising from participating companies.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "do-not-track",
    title: "Do Not Track Signals",
    content: (
      <>
        <p>
          Some browsers have a &quot;Do Not Track&quot; (DNT) setting. Currently,
          there is no universally accepted standard for how websites should respond
          to DNT signals. At this time, our site does not respond to DNT signals.
          We continue to monitor this area and will update our practices as standards
          evolve.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in
          our practices or for legal and regulatory reasons. Updates will be posted
          on this page. We encourage you to review this policy periodically.
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
          For questions about our use of cookies or this policy, contact us at{" "}
          <a href="mailto:hello@dreamstardc.com">hello@dreamstardc.com</a>.
        </p>
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="This policy explains how Dream Star Drivers Club uses cookies and similar tracking technologies on our website."
      lastUpdated="July 15, 2026"
      sections={SECTIONS}
    />
  );
}
