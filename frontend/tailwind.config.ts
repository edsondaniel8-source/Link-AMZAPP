import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(210 25% 7.8431%)",
        card: {
          DEFAULT: "hsl(180 6.6667% 97.0588%)",
          foreground: "hsl(210 25% 7.8431%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(210 25% 7.8431%)",
        },
        primary: {
          DEFAULT: "hsl(45 100% 50%)",
          foreground: "hsl(0 0% 0%)",
        },
        secondary: {
          DEFAULT: "hsl(170.9 100% 33.1%)",
          foreground: "hsl(0 0% 100%)",
        },
        success: {
          DEFAULT: "hsl(171.4 100% 26.9%)",
          foreground: "hsl(0 0% 100%)",
        },
        alert: {
          DEFAULT: "hsl(14.1 100% 56.9%)",
          foreground: "hsl(0 0% 100%)",
        },
        dark: {
          DEFAULT: "hsl(210 25% 13.3%)",
          foreground: "hsl(0 0% 100%)",
        },
        "gray-medium": "hsl(0 0% 44.3%)",
        "gray-light": "hsl(0 0% 96.9%)",
        muted: {
          DEFAULT: "hsl(240 1.9608% 90%)",
          foreground: "hsl(210 25% 7.8431%)",
        },
        accent: {
          DEFAULT: "hsl(211.5789 51.3514% 92.7451%)",
          foreground: "hsl(203.8863 88.2845% 53.1373%)",
        },
        destructive: {
          DEFAULT: "hsl(356.3033 90.5579% 54.3137%)",
          foreground: "hsl(0 0% 100%)",
        },
        border: "hsl(201.4286 30.4348% 90.9804%)",
        input: "hsl(200 23.0769% 97.4510%)",
        ring: "hsl(202.8169 89.1213% 53.1373%)",
        chart: {
          "1": "hsl(203.8863 88.2845% 53.1373%)",
          "2": "hsl(159.7826 100% 36.0784%)",
          "3": "hsl(42.0290 92.8251% 56.2745%)",
          "4": "hsl(147.1429 78.5047% 41.9608%)",
          "5": "hsl(341.4894 75.2000% 50.9804%)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["ui-serif", "Georgia", "serif"],
        mono: ["ui-monospace", "Menlo", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
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
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
