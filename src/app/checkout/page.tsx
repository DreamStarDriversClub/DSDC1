"use client";

import { useState, useCallback, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { validateCouponAction } from "@/lib/cart-actions";
import { formatPrice } from "@/lib/utils";
import { SHIPPING_RATES, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";

/* ── Types ──────────────────────────────────────────────── */

type CheckoutStep = "shipping" | "payment";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

/* ── US States ──────────────────────────────────────────── */

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

/* ── Page ───────────────────────────────────────────────── */

export default function CheckoutPage() {
  const {
    state,
    applyCoupon,
    setShipping,
    clearCart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    itemCount,
  } = useCart();

  const router = useRouter();

  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const { coupon, couponError } = state;

  /* ── Coupon ──────────────────────────────────────── */

  const handleApplyCoupon = useCallback(async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const result = await validateCouponAction(couponInput.trim(), subtotal);
      if (result.valid && result.coupon) {
        applyCoupon(result.coupon, null);
      } else {
        applyCoupon(null, result.error || "Invalid coupon");
      }
    } catch {
      applyCoupon(null, "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  }, [couponInput, subtotal, applyCoupon]);

  /* ── Form ────────────────────────────────────────── */

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [formErrors],
  );

  const validateShippingForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Please enter a valid email";

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.line1.trim()) errors.line1 = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zip.trim()) errors.zip = "ZIP code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleShippingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep("payment");
    }
  };

  /* ── Stripe Checkout ─────────────────────────────── */

  const handleStripeCheckout = useCallback(async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const shippingAddress = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        line1: formData.line1,
        line2: formData.line2 || undefined,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country || "US",
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            slug: item.slug,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            variantName: item.variantName,
          })),
          shippingAddress,
          shippingMethod: state.shippingMethod,
          subtotal,
          discount,
          shipping,
          tax,
          total,
          coupon: state.coupon,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setCheckoutError(data.error);
        return;
      }

      if (data.url) {
        router.push(data.url);
      } else {
        setCheckoutError("No checkout URL returned. Please try again.");
      }
    } catch {
      setCheckoutError("An error occurred. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }, [state, formData, subtotal, discount, shipping, tax, total, router]);

  /* ── Empty cart guard ────────────────────────────── */

  if (state.items.length === 0) {
    return (
      <>
        <Container className="py-8">
          <Breadcrumbs items={breadcrumbItems} />
        </Container>

        <section className="section-padding">
          <Container>
            <div className="mx-auto max-w-lg text-center">
              <h1 className="font-display text-3xl font-bold text-ds-white">
                Your cart is empty
              </h1>
              <p className="mt-3 text-ds-gray-300">
                Add some items before checking out.
              </p>
              <div className="mt-8">
                <Link href="/shop">
                  <Button variant="primary" size="lg">
                    Browse Shop
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout" },
  ];

  /* ── Checkout Steps ──────────────────────────────── */

  return (
    <>
      <Container className="py-8">
        <Breadcrumbs items={breadcrumbItems} />
      </Container>

      <section className="section-padding-tight">
        <Container>
          <h1 className="mb-2 font-display text-3xl font-bold text-ds-white">
            Checkout
          </h1>

          {/* ── Step Indicator ──────────────────────── */}
          <div className="mb-10 flex items-center gap-2">
            {(["shipping", "payment"] as CheckoutStep[]).map(
              (s, idx) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      step === s
                        ? "bg-ds-red text-white"
                        : step === "payment" && idx < 1
                          ? "bg-green-500/20 text-green-400"
                          : "bg-ds-black-darkgray text-ds-gray-400"
                    }`}
                  >
                    {step === "payment" && idx < 1 ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium capitalize hidden sm:inline ${
                      step === s ? "text-ds-white" : "text-ds-gray-400"
                    }`}
                  >
                    {s}
                  </span>
                  {idx < 1 && (
                    <div
                      className={`h-px w-8 ${
                        step === "payment"
                          ? "bg-green-500/30"
                          : "bg-white/[0.08]"
                      }`}
                    />
                  )}
                </div>
              ),
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── Main form area ────────────────────── */}
            <div className="lg:col-span-2">
              {/* ── Step 1: Shipping ────────────────── */}
              {step === "shipping" && (
                <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6 sm:p-8">
                  <h2 className="font-display text-xl font-bold text-ds-white mb-6">
                    Shipping Address
                  </h2>

                  <form onSubmit={handleShippingSubmit} className="space-y-5">
                    {/* Contact info */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="your@email.com"
                        className={`w-full rounded-lg border bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 focus:outline-none focus:ring-1 ${
                          formErrors.email
                            ? "border-ds-red focus:ring-ds-red/30"
                            : "border-white/[0.08] focus:border-ds-red/50 focus:ring-ds-red/30"
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-ds-red">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Name */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          className={`w-full rounded-lg border bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 focus:outline-none focus:ring-1 ${
                            formErrors.firstName
                              ? "border-ds-red focus:ring-ds-red/30"
                              : "border-white/[0.08] focus:border-ds-red/50 focus:ring-ds-red/30"
                          }`}
                        />
                        {formErrors.firstName && (
                          <p className="mt-1 text-xs text-ds-red">
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => updateField("lastName", e.target.value)}
                          className={`w-full rounded-lg border bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 focus:outline-none focus:ring-1 ${
                            formErrors.lastName
                              ? "border-ds-red focus:ring-ds-red/30"
                              : "border-white/[0.08] focus:border-ds-red/50 focus:ring-ds-red/30"
                          }`}
                        />
                        {formErrors.lastName && (
                          <p className="mt-1 text-xs text-ds-red">
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={formData.line1}
                        onChange={(e) => updateField("line1", e.target.value)}
                        placeholder="123 Main St"
                        className={`w-full rounded-lg border bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 focus:outline-none focus:ring-1 ${
                          formErrors.line1
                            ? "border-ds-red focus:ring-ds-red/30"
                            : "border-white/[0.08] focus:border-ds-red/50 focus:ring-ds-red/30"
                        }`}
                      />
                      {formErrors.line1 && (
                        <p className="mt-1 text-xs text-ds-red">
                          {formErrors.line1}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                        Apt, Suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.line2}
                        onChange={(e) => updateField("line2", e.target.value)}
                        placeholder="Apt 4B"
                        className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                      />
                    </div>

                    {/* City / State / ZIP */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className={`w-full rounded-lg border bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 focus:outline-none focus:ring-1 ${
                            formErrors.city
                              ? "border-ds-red focus:ring-ds-red/30"
                              : "border-white/[0.08] focus:border-ds-red/50 focus:ring-ds-red/30"
                          }`}
                        />
                        {formErrors.city && (
                          <p className="mt-1 text-xs text-ds-red">
                            {formErrors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                          State *
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => updateField("state", e.target.value)}
                          className={`w-full rounded-lg border bg-ds-black px-4 py-2.5 text-sm text-ds-white focus:outline-none focus:ring-1 ${
                            formErrors.state
                              ? "border-ds-red focus:ring-ds-red/30"
                              : "border-white/[0.08] focus:border-ds-red/50 focus:ring-ds-red/30"
                          }`}
                        >
                          <option value="">Select state</option>
                          {US_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        {formErrors.state && (
                          <p className="mt-1 text-xs text-ds-red">
                            {formErrors.state}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={formData.zip}
                          onChange={(e) => updateField("zip", e.target.value)}
                          className={`w-full rounded-lg border bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 focus:outline-none focus:ring-1 ${
                            formErrors.zip
                              ? "border-ds-red focus:ring-ds-red/30"
                              : "border-white/[0.08] focus:border-ds-red/50 focus:ring-ds-red/30"
                          }`}
                        />
                        {formErrors.zip && (
                          <p className="mt-1 text-xs text-ds-red">
                            {formErrors.zip}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full gap-2"
                      >
                        Continue to Payment
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── Step 2: Payment ─────────────────── */}
              {step === "payment" && (
                <div className="space-y-6">
                  {/* Shipping Method */}
                  <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-xl font-bold text-ds-white">
                        Shipping Method
                      </h2>
                      <button
                        onClick={() => setStep("shipping")}
                        className="text-xs text-ds-gray-400 transition-colors hover:text-ds-white"
                      >
                        Edit Address
                      </button>
                    </div>

                    {/* Address summary */}
                    <div className="mb-6 rounded-lg border border-white/[0.06] bg-ds-black px-4 py-3 text-sm text-ds-gray-300">
                      <p className="font-medium text-ds-white">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p>{formData.line1}{formData.line2 ? `, ${formData.line2}` : ""}</p>
                      <p>
                        {formData.city}, {formData.state} {formData.zip}
                      </p>
                      <p className="mt-1 text-xs text-ds-gray-400">
                        {formData.email}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Standard */}
                      <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-white/[0.08] bg-ds-black p-4 transition-colors hover:border-ds-red/30">
                        <input
                          type="radio"
                          name="shipping"
                          checked={state.shippingMethod === "standard"}
                          onChange={() => setShipping("standard")}
                          className="h-4 w-4 accent-ds-red"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-ds-white">
                            Standard Shipping
                          </p>
                          <p className="text-xs text-ds-gray-400">
                            5-7 business days
                          </p>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            shipping === 0 ? "text-green-400" : "text-ds-white"
                          }`}
                        >
                          {subtotal >= FREE_SHIPPING_THRESHOLD
                            ? "Free"
                            : formatPrice(SHIPPING_RATES.standard.price)}
                        </span>
                      </label>

                      {/* Express */}
                      <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-white/[0.08] bg-ds-black p-4 transition-colors hover:border-ds-red/30">
                        <input
                          type="radio"
                          name="shipping"
                          checked={state.shippingMethod === "express"}
                          onChange={() => setShipping("express")}
                          className="h-4 w-4 accent-ds-red"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-ds-white">
                            Express Shipping
                          </p>
                          <p className="text-xs text-ds-gray-400">
                            2-3 business days
                          </p>
                        </div>
                        <span className="text-sm font-bold text-ds-white">
                          {formatPrice(SHIPPING_RATES.express.price)}
                        </span>
                      </label>

                      {/* Free (if eligible) */}
                      {subtotal >= FREE_SHIPPING_THRESHOLD && (
                        <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                          <input
                            type="radio"
                            name="shipping"
                            checked={state.shippingMethod === "free"}
                            onChange={() => setShipping("free")}
                            className="h-4 w-4 accent-green-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-green-400">
                              Free Shipping
                            </p>
                            <p className="text-xs text-ds-gray-400">
                              5-7 business days
                            </p>
                          </div>
                          <span className="text-sm font-bold text-green-400">
                            Free
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Payment — Stripe Checkout */}
                  <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6 sm:p-8">
                    <h2 className="font-display text-xl font-bold text-ds-white mb-6">
                      Payment
                    </h2>

                    <div className="space-y-5">
                      {/* Pay with Card button */}
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full gap-2"
                        onClick={handleStripeCheckout}
                        disabled={checkoutLoading}
                      >
                        {checkoutLoading ? (
                          <>
                            <svg
                              className="h-4 w-4 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Redirecting to Stripe…
                          </>
                        ) : (
                          <>
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h2m12-8v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h14a2 2 0 012 2z"
                              />
                            </svg>
                            Pay with Card
                          </>
                        )}
                      </Button>

                      {checkoutError && (
                        <div className="rounded-xl border border-ds-red/30 bg-ds-red/5 p-4">
                          <p className="text-sm text-ds-red">{checkoutError}</p>
                        </div>
                      )}

                      {/* Order summary inside payment for review */}
                      <div className="mt-6 rounded-xl border border-white/[0.06] bg-ds-black p-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-ds-gray-400 mb-3">
                          You&apos;re Paying
                        </h3>

                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-ds-gray-300">Subtotal</span>
                            <span className="text-ds-white">{formatPrice(subtotal)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-green-400">
                              <span>Discount</span>
                              <span>-{formatPrice(discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-ds-gray-300">Shipping</span>
                            <span className={shipping === 0 ? "text-green-400" : "text-ds-white"}>
                              {shipping === 0 ? "Free" : formatPrice(shipping)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ds-gray-300">Tax (est.)</span>
                            <span className="text-ds-white">{formatPrice(tax)}</span>
                          </div>
                          <div className="border-t border-white/[0.06] pt-1.5 mt-1.5">
                            <div className="flex justify-between">
                              <span className="font-semibold text-ds-white">Total</span>
                              <span className="font-bold text-ds-white">
                                {formatPrice(total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-center text-xs text-ds-gray-600">
                        Powered by{" "}
                        <span className="font-semibold text-ds-gray-500">Stripe</span>.
                        Secure payment processing.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Order summary sidebar ──────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6">
                <h2 className="font-display text-lg font-bold text-ds-white mb-4">
                  Order Summary
                </h2>

                {/* Item count */}
                <p className="text-sm text-ds-gray-400 mb-4">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>

                {/* Cart items preview */}
                <div className="mb-4 max-h-48 overflow-y-auto space-y-2">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-ds-black-darkgray text-[10px] font-bold text-ds-gray-400">
                        {item.quantity}×
                      </span>
                      <span className="flex-1 truncate text-xs text-ds-gray-300">
                        {item.name}
                        {item.variantName && (
                          <span className="text-ds-gray-600"> — {item.variantName}</span>
                        )}
                      </span>
                      <span className="text-xs text-ds-gray-400">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                {!coupon ? (
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        placeholder="Promo code"
                        className="flex-1 rounded-lg border border-white/[0.08] bg-ds-black px-3 py-1.5 text-xs text-ds-white placeholder-ds-gray-600 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                      >
                        {couponLoading ? "..." : "Apply"}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="mt-1 text-xs text-ds-red">{couponError}</p>
                    )}
                  </div>
                ) : (
                  <div className="mb-4 flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2">
                    <span className="text-xs font-semibold text-green-400">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => {
                        applyCoupon(null, null);
                        setCouponInput("");
                      }}
                      className="text-xs text-ds-gray-400 hover:text-ds-red"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ds-gray-300">Subtotal</span>
                    <span className="text-ds-white">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-ds-gray-300">Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : "text-ds-white"}>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ds-gray-300">Tax (est.)</span>
                    <span className="text-ds-white">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-white/[0.06] pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-ds-white">Total</span>
                      <span className="text-lg font-bold text-ds-white">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure checkout badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ds-gray-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>Secure Checkout via Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
