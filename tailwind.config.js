/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#e11d48",
          secondary: "#57534e",
          accent: "#fda4af",
          neutral: "#fda4af",
          "base-100": "#f3f4f6",
          info: "#fb7185",
          success: "#a3e635",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
