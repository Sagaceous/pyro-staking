/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    colors: {
      'pyro': '#343434',
      'amount': '#807F7E',
      'gradientborder': `linear-gradient(90deg, #FBD407 0%, #FB2032 78%, #FB2032 100%);`,
    },
    
    extend: {
      backgroundImage: (theme) => ({
        'gradientborder': `linear-gradient(90deg, #FBD407 0%, #FB2032 78%, #FB2032 100%);`,
      }),
    },
  },
  plugins: [],
}
