import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          green: "#2D7A3A",
          "green-light": "#4CAF50",
          "green-dark": "#1B5E20",
          "green-muted": "#E8F5E9",
        },
        soil: {
          brown: "#5D4037",
          light: "#8D6E63",
          cream: "#EFEBE9",
        },
        harvest: {
          gold: "#F9A825",
          "gold-light": "#FFF8E1",
        },
        disease: {
          red: "#D32F2F",
          "red-light": "#FFEBEE",
          orange: "#F57C00",
          "orange-light": "#FFF3E0",
          yellow: "#FBC02D",
          "yellow-light": "#FFFDE7",
        },
        healthy: {
          green: "#388E3C",
          "green-light": "#E8F5E9",
        },
      },
      spacing: {
        "touch-sm": "44px",
        touch: "48px",
        "touch-lg": "56px",
        "touch-xl": "64px",
        "touch-2xl": "80px",
      },
      fontSize: {
        body: ["18px", "28px"],
        "body-sm": ["16px", "24px"],
        "heading-lg": ["28px", "36px"],
        heading: ["24px", "32px"],
        "heading-sm": ["20px", "28px"],
        caption: ["14px", "20px"],
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        input: "10px",
        badge: "20px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)",
        button: "0 2px 4px rgba(45,122,58,0.3)",
        nav: "0 -2px 10px rgba(0,0,0,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-noto-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        indic: ["var(--font-noto-devanagari)", "var(--font-noto-sans)", "ui-sans-serif", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "pulse-green": "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
