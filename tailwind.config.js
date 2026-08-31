/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(15, 23, 42, 0.8), 0 18px 40px rgba(14, 165, 233, 0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')()],
};

