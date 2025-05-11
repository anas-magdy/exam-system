/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "../node_modules/flowbite"
  ],
  theme: {
    extend: {
      colors: {
        'main': "green"
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

