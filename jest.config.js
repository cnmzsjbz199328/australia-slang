/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts", "**/__tests__/**/*.test.ts"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};

module.exports = createJestConfig(config);
