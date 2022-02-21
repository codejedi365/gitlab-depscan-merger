const tsJestPresets = {
  preset: "ts-jest",
  globals: {
    DEV_ENTRYPOINT: "./src/index.ts",
    "ts-jest": {
      tsconfig: "tsconfig.jest.json"
    }
  }
};

module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 50,
      lines: 50,
      statements: 50,
      functions: 100
    }
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/types/**/*.d.ts",
    "!**/node_modules/**"
  ],
  projects: [
    {
      displayName: "UNIT",
      ...tsJestPresets,
      runner: "@codejedi365/jest-serial-runner",
      setupFilesAfterEnv: ["jest-extended/all", "./tests/setupTests.ts"],
      testPathIgnorePatterns: ["/node_modules/"],
      testMatch: ["<rootDir>/src/**/__tests__/**/*.spec.ts"]
    },
    {
      displayName: "SYSTEM",
      ...tsJestPresets,
      runner: "@codejedi365/jest-serial-runner",
      setupFilesAfterEnv: ["jest-extended/all", "./tests/setupTests.ts"],
      testMatch: ["<rootDir>/tests/**/*.sys-test.ts"]
    }
  ]
};
