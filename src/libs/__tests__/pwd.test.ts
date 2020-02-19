import { default as pwd } from '../pwd';
const fs = require('fs');

describe('pwd function', () => {
  beforeAll(() => {
    console.log(__dirname);
    // fs.writeFileSync()
  });

  test('should return current path if no flags passed', () => {
    // handles empty cmdArgs
  });
  test('', () => {
    // handles invalid flags
  });
  test('', () => {
    // resolves phys path or returns path arg
  });
});
