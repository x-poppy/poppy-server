// eslint-disable-next-line no-undef

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

const coverageThreshold = parseInt(process.env.TEST_COVERAGE_THRESHOLD) || 0;

module.exports = {
  coverageThreshold: {
    global: {
      branches: coverageThreshold,
      functions: coverageThreshold,
      lines: coverageThreshold,
      statements: coverageThreshold,
    },
  },
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./src/jest.setup.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.test.ts$',
  moduleFileExtensions: ['ts', 'js', 'node'],
};
