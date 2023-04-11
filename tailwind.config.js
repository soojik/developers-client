const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  content: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        accent: {
          100: "#52ea54b3",
          200: "#52ea55",
          300: "#00fc04",
          400: "#42d04c",
          500: "#09890b",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
