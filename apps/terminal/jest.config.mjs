import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  passWithNoTests: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/.turbo/**',
    '!**/dist/**',
  ],
};

export default createJestConfig(config);
