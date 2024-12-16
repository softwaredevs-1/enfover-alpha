/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customDarkBlue: '#203060',
        customLightBlue: '#92D4D5',
        customHoverBlue: '#214F60',
        customBg: '#E0F3F6',
        customByellow: '#ECC500',
        customNav : '#c5aa6a', 
        orderlyRed: "#8F1D1D"
      },
      keyframes: {
        'rise-up-once': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50px)' }, // Adjust the final position as needed
        },
      },
      animation: {
        'rise-up-once': 'rise-up-once 2s ease-in-out forwards', // 3s is the splash screen duration
      },
    },
  },
  plugins: [],
};
