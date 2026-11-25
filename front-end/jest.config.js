/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next/image$': '<rootDir>/src/__mocks__/next-image.tsx',
    '^next/link$': '<rootDir>/src/__mocks__/next-link.tsx',
    '^next/navigation$': '<rootDir>/src/__mocks__/next-navigation.ts',
  },
  testMatch: ['**/__tests__/**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
};

module.exports = config;
