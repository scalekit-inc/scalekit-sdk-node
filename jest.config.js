module.exports = {
  verbose: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['./tests/setup.ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^jose': require.resolve('jose'),
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testTimeout: 10000,
}; 