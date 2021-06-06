// eslint-disable-next-line no-undef
module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./src/jest.setup.ts'],
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.test.ts$',
  moduleFileExtensions: ['ts', 'js'],
};
