/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ember: "#f59e0b",
        arcane: "#38bdf8",
        aether: "#7dd3fc",
        verdant: "#22c55e",
        blood: "#ef4444",
        void: "#060812",
        panel: "#0f1724",
        surface: "#151f2f"
      },
      boxShadow: {
        glow: "0 0 28px rgba(56, 189, 248, 0.22)",
        ember: "0 0 24px rgba(245, 158, 11, 0.2)"
      }
    }
  },
  plugins: []
};
