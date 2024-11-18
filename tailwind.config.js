import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "var(--b3-theme-primary)",
          secondary: "var(--b3-theme-secondary)",
        },
      },
    ],
  },
};
