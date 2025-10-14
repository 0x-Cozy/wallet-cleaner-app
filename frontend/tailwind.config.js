/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'legit': '#10b981',
        'suspicious': '#f59e0b',
        'scam': '#ef4444',
      }
    },
  },
  plugins: [],
}
