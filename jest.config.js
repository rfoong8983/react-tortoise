module.exports = {
  /**
   * The root of your source code, typically /src
   * `<rootDir>` is a token Jest substitutes
   */
  roots: ['<rootDir>/src'],

  /**
   * Jest transformations -- this adds support for TypeScript
   * using ts-jest
   */
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  /**
   * Runs special logic (immediately after test framework installed in environment),
   * such as cleaning up components when using React Testing Library
   * and adds special extended assertions to Jest
   */
  setupFilesAfterEnv: [
    '@testing-library/react/cleanup-after-each',
    '@testing-library/jest-dom/extend-expect',
  ],

  moduleNameWrapper: {
    electron: '<rootDir>/src/__mocks__/electron.js',
  },

  /**
   * Test spec file resolution pattern
   * Matches parent folder `__tests__` and filename
   * should contain `test` or `spec`.
   */
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
