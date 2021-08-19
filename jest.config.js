// eslint-disable-next-line no-undef

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./src/jest.setup.ts'],
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.test.ts$',
  moduleFileExtensions: ['ts', 'js', 'node'],
};
