module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "standard",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
    "plugin:vue/vue3-strongly-recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/ban-ts-comment": ["warn"],
    "no-useless-constructor": ["off"],
    "@typescript-eslint/no-useless-constructor": ["error"],
    "no-use-before-define": "off",
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-explicit-any": ["error"],
    "@typescript-eslint/no-non-null-assertion": ["error"],
    "@typescript-eslint/no-unused-vars": ["error"],
  },
};
