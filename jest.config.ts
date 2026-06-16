import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(test).[jt]s?(x)",
  ],

  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/tests/",
    "\\.spec\\.[jt]sx?$",
  ],
};

export default createJestConfig(customJestConfig);
