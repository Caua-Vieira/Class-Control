/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  setupFiles: ["reflect-metadata"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "tsconfig.test.json",
    }],
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/task-reminder-cron.ts",
    "!src/infrastructure/config/ioc.ts",
    "!src/infrastructure/config/logger.ts",
    "!src/infrastructure/database/**",
    "!src/infrastructure/messaging/**",
    "!src/infrastructure/email/nodemailer-service.ts",
    "!src/infrastructure/repositories/**",
    "!src/interfaces/server.ts",
    "!src/interfaces/routes/**",
    "!src/workers/task-created-worker.ts",
  ],
  coverageReporters: ["text", "lcov"],
  coverageDirectory: "coverage",
};