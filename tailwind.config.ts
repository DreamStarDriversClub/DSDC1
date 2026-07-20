import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "ds-red": {
          DEFAULT: "#DC2626",
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
        },
        "ds-black": {
          DEFAULT: "#0A0A0A",
          deepest: "#050505",
          elevated: "#111111",
          charcoal: "#1A1A1A",
          darkgray: "#2A2A2A",
        },
        "ds-gray": {
          100: "#E5E7EB",
          200: "#D1D5DB",
          300: "#B0B0B0",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#333333",
          800: "#1F2937",
          900: "#111827",
        },
        "ds-gold": {
          DEFAULT: "#D4AF37",
          light: "#E5C158",
          dark: "#B8960F",
          muted: "rgba(212, 175, 55, 0.15)",
        },
        "ds-white": "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ["Sprite Graffiti", "cursive", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "display-xl": [
          "clamp(3rem, 8vw, 7rem)",
          { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "900" },
        ],
        "display-lg": [
          "clamp(2.25rem, 5vw, 4rem)",
          { lineHeight: "1.0", letterSpacing: "-0.02em", fontWeight: "900" },
        ],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        100: "25rem",
        112: "28rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "brand-glow":
          "0 0 40px rgba(220, 38, 38, 0.15), 0 0 80px rgba(220, 38, 38, 0.05)",
        "brand-glow-sm":
          "0 0 15px rgba(220, 38, 38, 0.2), 0 0 30px rgba(220, 38, 38, 0.08)",
        "gold-glow":
          "0 0 30px rgba(212, 175, 55, 0.15), 0 0 60px rgba(212, 175, 55, 0.05)",
        "card": "0 1px 3px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)",
        "card-hover":
          "0 4px 20px rgba(0, 0, 0, 0.6), 0 0 30px rgba(220, 38, 38, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-down": "fadeInDown 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        "slide-out-right": "slideOutRight 0.3s ease-in forwards",
        "slide-in-left": "slideInLeft 0.3s ease-out forwards",
        "star-streak": "starStreak 8s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "sakura-drift": "sakuraDrift 12s ease-in-out infinite",
        "card-lift": "cardLift 0.4s ease-out forwards",
        "stagger-1": "fadeInUp 0.6s ease-out 0.1s forwards",
        "stagger-2": "fadeInUp 0.6s ease-out 0.2s forwards",
        "stagger-3": "fadeInUp 0.6s ease-out 0.3s forwards",
        "stagger-4": "fadeInUp 0.6s ease-out 0.4s forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        starStreak: {
          "0%": { transform: "translateX(-100%) translateY(0)", opacity: "0" },
          "50%": { opacity: "0.6" },
          "100%": { transform: "translateX(200%) translateY(-10px)", opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(220, 38, 38, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(220, 38, 38, 0.35)" },
        },
        sakuraDrift: {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0.3" },
          "50%": { transform: "translate(20px, -30px) rotate(8deg)", opacity: "0.6" },
          "100%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0.3" },
        },
        cardLift: {
          "0%": { transform: "translateY(0)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)" },
          "100%": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(220, 38, 38, 0.08)",
          },
        },
      },
      backgroundImage: {
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow":
          "radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.08) 0%, transparent 70%)",
      },
      transitionDuration: {
        400: "400ms",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },
  plugins: [],
};

export default config;
