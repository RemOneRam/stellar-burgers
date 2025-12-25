module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1',
    '^@selectors$': '<rootDir>/src/services/selectors',
    '^(\\.\\./)+utils/(.*)$': '<rootDir>/src/utils/$2',
    '\\.(css|less|scss|sass)$': 'jest-css-modules-transform'
  },
  moduleDirectories: ['node_modules', '<rootDir>', '<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/index.tsx',
    '!src/stories/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};


