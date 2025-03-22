/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        mthin: ["Montserrat-Thin", "sans-serif"],
        mextralight: ["Montserrat-ExtraLight", "sans-serif"],
        mlight: ["Montserrat-Light", "sans-serif"],
        mregular: ["Montserrat-Regular", "sans-serif"],
        mmedium: ["Montserrat-Medium", "sans-serif"],
        msemibold: ["Montserrat-SemiBold", "sans-serif"],
        mbold: ["Montserrat-Bold", "sans-serif"],
        mextrabold: ["Montserrat-ExtraBold", "sans-serif"],
        mblack: ["Montserrat-Black", "sans-serif"],
      },
      colors: {
        primary: {
          light: '#F0F8C7', // Lightened version of #E4F3A3
          DEFAULT: '#E4F3A3', // Base color
          dark: '#B0C878', // Darkened version
          contrast: '#1F2F13', // High contrast (dark green)
        },
        secondary: {
          light: '#E8DFF9', // Lightened version of #CCADF7
          DEFAULT: '#CCADF7', // Base color
          dark: '#9C7EBF', // Darkened version
          contrast: '#2F1F3A', // High contrast (dark purple)
        },
        accent: {
          light: '#FFF7E5', // Soft complementary accent
          DEFAULT: '#FFD966', // Golden yellow for contrast
          dark: '#B78F33', // Darkened version
        },
        neutral: {
          light: '#F7F7F7', // Very light gray
          DEFAULT: '#E0E0E0', // Standard gray
          dark: '#A0A0A0', // Dark gray
        },
      },
    },
  },
  plugins: [],
}