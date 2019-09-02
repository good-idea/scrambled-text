module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  testMatch: ['**/**/*.test.ts', '**/**/*.test.tsx'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'coverage',
    '/__.*__/',
    'jest.config.js',
  ],
  testEnvironment: 'jsdom',

  transformIgnorePatterns: ['/!node_modules\\/lodash-es/'],
  collectCoverageFrom: ['./src/**/*.{ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
