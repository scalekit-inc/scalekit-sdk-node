module.exports = {
  verbose: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['./tests/setup.ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.js$': '<rootDir>/tests/transform-esm-js.cjs',
  },
  transformIgnorePatterns: ['/node_modules/(?!(jose)/)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testTimeout: 30000,
  maxWorkers: 1,
};
