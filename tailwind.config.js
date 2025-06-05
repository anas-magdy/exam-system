// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{html,ts}",
//     "./node_modules/flowbite/**/*.js", // ✅ الصيغة الصحيحة
//   ],
//   theme: {
//     extend: {
//       colors: {
//         main: "green",
//         primary: '#16A34A',
//         'primary-dark': '#12803a',
//         'primary-light': '#22c55e',
//       },
//     },
//   },
//   plugins: [require("flowbite/plugin")],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js", // ✅ الصيغة الصحيحة
  ],

  theme: {
    extend: {
      colors: {
        main: "#16A34A",
        primary: "#16A34A",
        "primary-dark": "#12803a",
        "primary-light": "#22c55e",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(40px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "slide-in": {
          "0%": {
            opacity: "0",
            filter: "blur(8px)",
            transform: "translateX(80px)",
          },
          "100%": {
            opacity: "1",
            filter: "blur(0)",
            transform: "translateX(0)",
          },
        },
        "slide-out": {
          "0%": { opacity: "1", filter: "blur(0)", transform: "translateX(0)" },
          "100%": {
            opacity: "0",
            filter: "blur(8px)",
            transform: "translateX(-80px)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(.4,2,.3,1) both",
        "slide-in": "slide-in 0.6s cubic-bezier(.4,2,.3,1) both",
        "slide-out": "slide-out 0.6s cubic-bezier(.4,2,.3,1) both",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
