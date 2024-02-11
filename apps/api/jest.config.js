/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // See https://jestjs.io/docs/configuration#testpathignorepatterns-arraystring
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/dist/'],
  forceExit: true,
  // clearMocks: true,
  // resetMocks: true,
  // restoreMocks: true,
};
