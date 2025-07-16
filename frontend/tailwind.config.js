// frontend/tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        blue: { 500: '#1E90FF' },
        green: { 500: '#00C49A' },
        gray: { 800: '#1A1C20', 900: '#121418' },
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      backgroundImage: {
        // 'light-pattern': "url('./images/light-bg.jpg')",
        // dashboard: "url('./images/dark-bg.jpg')",
      },

      // ADD dropdown animation here:
      keyframes: {
        dropdown: {
          '0%': { opacity: '0', transform: 'translateY(-10px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        dropdown: 'dropdown 0.3s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};
