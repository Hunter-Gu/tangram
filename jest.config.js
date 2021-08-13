const path = require("path");

function resolve(...paths) {
  return path.resolve(__dirname, ...paths);
}

module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  rootDir: "src",
  testMatch: ["**/__tests__/**/*.test.ts"],
};
