module.exports = {
    collectCoverageFrom: ["src/core/blocs/**/*.{js,jsx,ts,tsx}", "src/core/presenters/**/*.{js,jsx,ts,tsx}","src/core/domain/**/*.{js,jsx,ts,tsx}"],
    preset: "ts-jest",
    coverageReporters: [
      "json-summary",
      "lcov",
      "text-summary", // plus any other reporters, e.g. "lcov", "text", "text-summary"
    ],
    testEnvironment: "jsdom",
    coverageThreshold: {
      global: {
        branches: 30.15,
        functions: 40.35,
        lines: 39.75,
        statements: 38.5,
      },
    },
  };
  