/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: { '108': '1.08' },
      colors : {
        // Brand Colors
        "primary-200" : "#FF4D00",
        "primary-100" : "#FF6A2F",
        "primary-50"  : "#FFF0E8",
        
        // Accent / Secondary
        "secondary-200" : "#1A1A2E",
        "secondary-100" : "#E94560",
        "secondary-50"  : "#FFF0F3",

        // Gold Accent for premium feel
        "gold-200" : "#C9A84C",
        "gold-100" : "#E8C97A",
        "gold-50"  : "#FDF8EC",

        // Neutral / Fashion
        "fashion-dark"   : "#111111",
        "fashion-charcoal" : "#2D2D2D",
        "fashion-gray"   : "#6B6B6B",
        "fashion-light"  : "#F8F5F2",
        "fashion-white"  : "#FFFFFF",

        // Status colors (stock)
        "stock-high"  : "#22C55E",
        "stock-low"   : "#F59E0B",
        "stock-none"  : "#EF4444",
      },
      fontFamily : {
        "poppins" : ["Poppins", "sans-serif"],
        "playfair": ["Playfair Display", "serif"],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 50%, #E94560 100%)',
        'card-hover': 'linear-gradient(180deg, transparent 0%, rgba(17,17,17,0.8) 100%)',
        'orange-gradient': 'linear-gradient(135deg, #FF4D00 0%, #E94560 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.16)',
        'orange': '0 8px 24px rgba(255,77,0,0.3)',
        'gold': '0 8px 24px rgba(201,168,76,0.3)',
        'dark': '0 8px 32px rgba(17,17,17,0.2)',
      }
    },
  },
  plugins: [],
}
