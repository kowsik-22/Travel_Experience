/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
        display: ['"Montserrat"', 'sans-serif'],
    },

    extend:{
        colors:{
            primary: '#05B6D3',
            secondary: '#EF863E',
        },
        backgroundImage: {
            'login-bg-img': "url('/images/bg-login.jpg')"
        },
    }
  },
  plugins: [],
}
