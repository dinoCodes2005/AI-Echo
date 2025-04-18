/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pulldown: {
          "0%": { transform: "translateY(-10%)" },
          "50%": { transform: "translateY(5%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        pulldown: "pulldown 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
