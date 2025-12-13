import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  extensionsToTreatAsEsm: [],
  transformIgnorePatterns: [
    'node_modules/(?!(jsdom|dompurify)/)',
  ],
  globals: {
    'ts-jest': {
      useESM: false,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/**/*.controller.ts', // Controllers are tested via integration tests
    '!src/routes/**/*.ts', // Routes are tested via integration tests
    '!src/scripts/**/*.ts',
    '!src/types/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/shared/(.*)$': '<rootDir>/../shared/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  maxWorkers: 1, // Run tests serially to avoid database conflicts
};

export default config;

