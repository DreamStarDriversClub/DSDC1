"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

type SubjectOption = "General" | "Order Support" | "Wholesale" | "Media";

interface FormData {
  name: string;
  email: string;
  subject: SubjectOption;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const SUBJECTS: SubjectOption[] = [
  "General",
  "Order Support",
  "Wholesale",
  "Media",
];

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "General",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    // Simulate submission — wire to API later
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "General", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 800);
  };

  const inputClasses =
    "w-full rounded-xl border border-white/[0.08] bg-ds-black-elevated px-4 py-3 text-sm text-ds-white placeholder-ds-gray-500 transition-colors focus:border-ds-red/50 focus:outline-none";
  const errorClasses = "border-ds-red/60 focus:border-ds-red";
  const labelClasses = "mb-1.5 block text-sm font-medium text-ds-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className={labelClasses}>
          Name <span className="text-ds-red">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData((p) => ({ ...p, name: e.target.value }));
            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
          }}
          placeholder="Your name"
          className={`${inputClasses} ${errors.name ? errorClasses : ""}`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-ds-red-400">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className={labelClasses}>
          Email <span className="text-ds-red">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData((p) => ({ ...p, email: e.target.value }));
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          placeholder="you@example.com"
          className={`${inputClasses} ${errors.email ? errorClasses : ""}`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-ds-red-400">{errors.email}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className={labelClasses}>
          Subject
        </label>
        <select
          id="contact-subject"
          value={formData.subject}
          onChange={(e) =>
            setFormData((p) => ({ ...p, subject: e.target.value as SubjectOption }))
          }
          className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className={labelClasses}>
          Message <span className="text-ds-red">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={formData.message}
          onChange={(e) => {
            setFormData((p) => ({ ...p, message: e.target.value }));
            if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
          }}
          placeholder="Tell us what's on your mind..."
          className={`${inputClasses} resize-y ${errors.message ? errorClasses : ""}`}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-ds-red-400">{errors.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "submitting"}
        className="w-full sm:w-auto"
      >
        {status === "submitting"
          ? "Sending..."
          : status === "success"
            ? "✓ Message Sent!"
            : "Send Message"}
      </Button>

      {/* Success message */}
      {status === "success" && (
        <div className="rounded-xl border border-ds-gold/20 bg-ds-gold-muted px-4 py-3">
          <p className="text-sm text-ds-gold-light">
            Thanks for reaching out! We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      )}
    </form>
  );
}
