module.exports = {
  verbose: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['./tests/setup.ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    // ESM-only dependencies (jose): convert to CommonJS without lowering syntax.
    '^.+\\.js$': '<rootDir>/tests/esm-to-cjs-transform.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!(jose)/)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testTimeout: 30000,
  maxWorkers: 1,
};
