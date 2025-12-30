/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-charcoal': '#2F3336',
        'brand-off-white': '#E7E9EA',
        'brand-pink': '#F06CB7',
        'brand-medium-gray': '#676767',
        'brand-dark-gray': '#616161',
        'brand-almost-black': '#262626',
        'brand-blue': '#0C8AE5',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
