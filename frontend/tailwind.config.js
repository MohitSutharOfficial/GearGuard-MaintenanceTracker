/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        odoo: {
          primary: '#714B67',
          secondary: '#875A7B',
          accent: '#8F7BA1',
          gray: '#E5E5E5',
          'dark-gray': '#4D4D4D',
          success: '#00A09D',
          warning: '#F0AD4E',
          danger: '#D9534F',
        }
      },
      fontFamily: {
        sans: ['Lucida Grande', 'Helvetica', 'Verdana', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
