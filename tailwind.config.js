module.exports = {
  mode: "jit",
  darkMode: "media",
  content: [
    "./pages/**/*.{js,jsx,ts,tsx,vue}",
    "./pages/garden/[leaf].tsx",
    "./components/**/*.{js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
