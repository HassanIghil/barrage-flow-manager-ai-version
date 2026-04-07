/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary":    "#060606",
        "bg-card":       "rgba(24, 24, 27, 0.4)",
        "bg-card-hover": "rgba(39, 39, 42, 0.5)",
        "bg-sidebar":    "#09090b",
        accent:          "#84cc16",
        "accent-light":  "#a3e635",
        "accent-glow":   "rgba(132, 204, 22, 0.2)",
        positive:        "#22c55e",
        warning:         "#f59e0b",
        danger:          "#ef4444",
        "border-dark":   "rgba(255, 255, 255, 0.1)",
        "text-primary":  "#fafafa",
        "text-muted":    "#71717a",
        "text-dim":      "#a1a1aa",
      },
      boxShadow: {
        card:    "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow:    "0 0 24px rgba(132, 204, 22, 0.2)",
        "glow-lg": "0 0 48px rgba(132, 204, 22, 0.15)",
        panel:   "0 4px 24px rgba(0,0,0,0.4)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        display: ["'Outfit'", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
