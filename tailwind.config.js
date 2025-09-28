/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan all files inside src for Tailwind/Nativewind classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
