/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        "rewee-orange": "hsla(12, 89%, 39%, 1)",
        "rewee-purple": "hsla(269, 64%, 38%, 1)",
        "rewee-yellow": "hsla(49, 93%, 67%, 1)",
        "rewee-green": "hsla(150, 100%, 12%, 1)",
        "rewee-black": "hsla(154, 89%, 4%, 1)",
      },
    },
  },
  plugins: [],
};
