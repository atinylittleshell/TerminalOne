/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  passWithNoTests: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/*.{ts}',
    '!**/tests/**',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/.turbo/**',
    '!**/dist/**',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.turbo/', '/dist/'],
};
