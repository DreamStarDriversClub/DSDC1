"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const [visible, setVisible] = useState(false);
  const [expandedShop, setExpandedShop] = useState(false);
  const shopLink = NAV_LINKS[0]; // Shop is first

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timeout);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-80 md:hidden">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute left-0 top-0 h-full w-[85%] max-w-sm border-r border-white/[0.06] bg-ds-black-elevated shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <span className="font-display text-sm font-bold tracking-widest text-ds-white">
            DREAM STAR
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-ds-gray-300 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
            aria-label="Close menu"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col py-4">
          {/* Shop with dropdown */}
          <div>
            <button
              onClick={() => setExpandedShop(!expandedShop)}
              className="flex w-full items-center justify-between px-6 py-3 text-left text-base font-medium text-ds-white transition-colors hover:text-ds-red"
            >
              {shopLink.label}
              <svg
                className={`h-4 w-4 text-ds-gray-400 transition-transform ${
                  expandedShop ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {expandedShop &&
              shopLink.children?.map((child) => (
                <a
                  key={child.label}
                  href={child.href}
                  onClick={onClose}
                  className="flex flex-col px-10 py-2 text-sm text-ds-gray-300 transition-colors hover:text-ds-white"
                >
                  <span className="font-medium">{child.label}</span>
                  <span className="text-xs text-ds-gray-600">
                    {child.description}
                  </span>
                </a>
              ))}
          </div>

          {/* Other links */}
          {NAV_LINKS.slice(1).map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="px-6 py-3 text-base font-medium text-ds-white transition-colors hover:text-ds-red"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] px-6 py-4">
          <a
            href="/contact"
            onClick={onClose}
            className="text-sm text-ds-gray-400 transition-colors hover:text-ds-white"
          >
            Need help? Contact us →
          </a>
        </div>
      </div>
    </div>
  );
}
