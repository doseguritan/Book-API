import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/tests/**/*.test.ts'], // Make sure Jest sees your files
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Important for TypeScript ESM
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
};

export default config;
