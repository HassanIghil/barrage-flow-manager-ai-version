/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        lagoon: "#0f766e",
        spray: "#d7f3ef",
        dune: "#f6f0e8",
        ink: "#1f2937",
        ember: "#dc2626",
      },
      boxShadow: {
        panel: "0 20px 60px rgba(15, 23, 42, 0.12)",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
