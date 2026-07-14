/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ember: "#f59e0b",
        arcane: "#38bdf8",
        void: "#070a12",
        panel: "#101622"
      },
      boxShadow: {
        glow: "0 0 24px rgba(56, 189, 248, 0.18)"
      }
    }
  },
  plugins: []
};
