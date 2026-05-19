import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // THE TWO FONTS — non-negotiable
        display: ["DM Serif Display", "Georgia", "serif"],  // Heroes + section titles
        body: ["Inter", "system-ui", "sans-serif"],          // Everything else
        heading: ["Inter", "system-ui", "sans-serif"],        // Alias for body
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Thread color tokens — amber at different strengths
        thread: {
          DEFAULT: "hsl(30 80% 38%)",
          light: "hsl(30 80% 38% / 0.12)",
          dark: "hsl(34 85% 52%)",
        },
        // Labyrinth tones — the darkness being navigated
        labyrinth: {
          DEFAULT: "hsl(28 18% 8%)",
          mid: "hsl(28 15% 11%)",
          light: "hsl(28 12% 16%)",
        },
        // Surface tones — the lit paths
        stone: {
          50: "hsl(38 18% 97%)",
          100: "hsl(38 18% 93%)",
          200: "hsl(32 12% 87%)",
          300: "hsl(32 10% 78%)",
          400: "hsl(28 8% 62%)",
          500: "hsl(28 8% 44%)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background, var(--background)))",
          foreground: "hsl(var(--sidebar-foreground, var(--foreground)))",
          primary: "hsl(var(--sidebar-primary, var(--primary)))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground, var(--primary-foreground)))",
          accent: "hsl(var(--sidebar-accent, var(--secondary)))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground, var(--secondary-foreground)))",
          border: "hsl(var(--sidebar-border, var(--border)))",
          ring: "hsl(var(--sidebar-ring, var(--ring)))",
        },
      },
      borderRadius: {
        // Sharp corners — infrastructure, not consumer
        lg: "0.375rem",   // 6px
        md: "0.25rem",    // 4px  
        sm: "0.125rem",   // 2px
        xl: "0.5rem",     // 8px — max
        "2xl": "0.5rem",  // 8px — same as xl, nothing rounder
        full: "9999px",   // pill only
      },
      // Thread-based spacing additions
      spacing: {
        "thread": "0.0625rem", // 1px — the thread itself
      },
      keyframes: {
        // Thread pulse — for critical alerts
        "thread-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        // Subtle entry animation
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "thread-pulse": "thread-pulse 2s ease-in-out infinite",
        "fade-up": "fade-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "72ch",
            color: "hsl(var(--foreground))",
            a: {
              color: "hsl(var(--primary))",
              textDecoration: "underline",
              textDecorationColor: "hsl(var(--border))",
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
