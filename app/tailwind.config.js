/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{tsx,ts,jsx,js}"],
  theme: {
    colors:{
      'bgGray': '#F4F4F4',
      'purple': '#9A48D6',
      'lighterPurple': '#b748d6',
      'fontGray': '#858484',
      'white':'#FFFFFF',
      'black':'#000000',
      'borderGray':"#CCCCCC"
    },
    extend: {
      fontFamily:{
        SourcePro:['Source Sans 3', 'sans-serif'],
      }
    },
  },
  plugins: [
  ],
}

