module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["assets/js/form.js"],
  coverageReporters: ["text", "html", "lcov"],
};