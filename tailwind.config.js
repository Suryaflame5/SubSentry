/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F7F4",
        surface: "#FFFFFF",
        "surface-subtle": "#F2F2EE",
        "surface-hover": "#EFEFEA",
        primary: "#17191C",
        secondary: "#697077",
        muted: "#9A9FA5",
        border: "#E4E6E3",
        "border-subtle": "#ECEEEB",
        accent: {
          DEFAULT: "#35B8A6",
          hover: "#2CA192",
          subtle: "#EAF7F5",
          border: "#B4E8E1",
        },
        warning: {
          DEFAULT: "#D99532",
          subtle: "#FEF7EC",
          border: "#F7D89D",
        },
        review: {
          DEFAULT: "#C9784A",
          subtle: "#FDF4EE",
          border: "#F5CEBA",
        },
        positive: {
          DEFAULT: "#298B69",
          subtle: "#EBF7F2",
          border: "#A6DDC9",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
        drawer: "-4px 0 24px rgba(0, 0, 0, 0.08)",
        dropdown: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
      }
    },
  },
  plugins: [],
}
