/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          blush: "#FFE4E1",
          lavender: "#F0E6FF",
          rose: "#FFB6C1",
          lilac: "#E6E6FA",
          peach: "#FFF8DC",
          mint: "#F5FFFA",
          gold: "#FFFACD",
          coral: "#FFE4E1",
          powder: "#FBF8F1",
          champagne: "#F7F3E9",
          sage: "#F0F8F0",
          cream: "#FFFDF0",
          sky: "#E6F3FF",
          butter: "#FFFACD",
          bubblegum: "#FCE4EC",
          periwinkle: "#E8EAF6",
          pistachio: "#F1F8E9",
          pink: "#FF69B4",
          pink200: "#FCE7F3",
          pink300: "#F9A8D4",
          pink400: "#F472B6",
          pink500: "#EC4899",
        },
        fontFamily: {
          cute: ["Poppins", "sans-serif"],
          elegant: ["Playfair Display", "serif"],
          modern: ["Inter", "sans-serif"],
        },
        animation: {
          'float': 'float 3s ease-in-out infinite',
          'bounce-slow': 'bounce 2s infinite',
          'pulse-gentle': 'pulse 3s ease-in-out infinite',
          'shimmer': 'shimmer 2s linear infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
        },
        boxShadow: {
          'soft': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
          'elegant': '0 10px 25px rgba(0, 0, 0, 0.15)',
          'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
          'neon': '0 0 5px rgba(255, 105, 180, 0.5), 0 0 10px rgba(255, 105, 180, 0.3)',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
      },
    },
    plugins: [],
  }
  