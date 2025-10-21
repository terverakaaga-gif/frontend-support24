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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens:{
        "xs": "320px",
        "sm": "412px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui"],
        montserrat: ["var(--font-montserrat)"],
        "montserrat-medium": [
          "var(--font-montserrat)",
          "ui-sans-serif",
          "system-ui",
        ],
        "montserrat-bold": [
          "var(--font-montserrat-bold)",
          "ui-sans-serif",
          "system-ui",
        ],
        "montserrat-semibold": [
          "var(--font-montserrat-semibold)",
          "ui-sans-serif",
          "system-ui",
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Updated primary colors to match the design's blue theme
        primary: {
          DEFAULT: "#0D2BEC", // Main blue from the design
          foreground: "#ffffff",
          50: "#f0f4ff",
          100: "#e0ecff",
          200: "#c7dbff",
          300: "#a4c2ff",
          400: "#7ea0ff",
          500: "#5b82ff",
          600: "#0D2BEC", // Main primary color
          700: "#1e3fff",
          800: "#1a2fd1",
          900: "#06136A",
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
        
        // Updated accent colors to match the yellow/orange from the design
        accent: {
          DEFAULT: "#E6A500", // Normal state yellow/orange
          foreground: "#ffffff",
          light: "#FEF3C7", // Light state
          50: "#FFFBEB", // Light state
          100: "#FEF3C7", // Light hover state
          200: "#FDE68A", // Light active state
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#E6A500", // Normal state
          600: "#D69E2E", // Normal hover state  
          700: "#B45309", // Normal active state
          800: "#92400E", // Dark state
          900: "#78350F", // Darker state
        },
        
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        
        // Updated support colors to match new primary
        support: {
          DEFAULT: "#0D2BEC",
          50: "#f0f4ff",
          100: "#e0ecff",
          200: "#c7dbff",
          300: "#a4c2ff",
          400: "#7ea0ff",
          500: "#5b82ff",
          600: "#0D2BEC",
          700: "#1e3fff",
          800: "#1a2fd1",
          900: "#1a2aa3",
        },
        
        guardian: {
          DEFAULT: "#0D2BEC",
          light: "#e0ecff",
          dark: "#1e3fff",
        },
        
        status: {
          confirmed: "#10b981", // Green
          pending: "#f59e0b",   // Amber
          progress: "#0D2BEC",  // Primary blue
        },
        
        // Updated gray scale to match the design
        gray: {
          50: "#FDFDFD",   // Main background color from design
          100: "#F7F7F7",  // Left panel background color
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",  // Text colors
          700: "#374151",
          800: "#1f2937",
          900: "#111827",  // Dark text
        },
        
        // Updated orange/yellow colors for links and accents
        orange: {
          50: "#FFFBEB", // Light state
          100: "#FEF3C7", // Light hover
          200: "#FDE68A", // Light active
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#E6A500", // Normal state from your color scheme
          600: "#D69E2E", // Normal hover
          700: "#B45309", // Normal active
          800: "#92400E", // Dark
          900: "#78350F", // Darker
        },
        
        // Additional colors from the design
        neutral: {
          50: "#FDFDFD",
          100: "#F7F7F7",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;