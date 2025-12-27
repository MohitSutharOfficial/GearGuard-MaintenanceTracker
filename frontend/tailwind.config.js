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
          light: '#F0EEEE',
          border: '#DDDDDD',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
          success: '#00A09D',
          warning: '#F0AD4E',
          danger: '#D9534F',
          info: '#00AFF5',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'odoo': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'odoo-md': '0 2px 6px 0 rgba(0, 0, 0, 0.12)',
        'odoo-lg': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
