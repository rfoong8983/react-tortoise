import { default as pwd } from '../pwd';
import fs from '../../__mocks__/fs';

describe('pwd function', () => {
  const path = './users/Tortle/documents/symlink';
  beforeAll(() => {
    fs.__setMockFiles(['users', 'Tortle', 'documents']);
    // symlink is a shortcut to test, defined in fs mock
    fs.__setMockFiles([
      './users/Tortle/documents/test',
      './users/Tortle/documents/symlink',
    ]);
  });

  describe('with no flags or invalid flags', () => {
    test('should return current path if no flags passed', () => {
      const cmdArgs: string[] = [];
      expect(pwd(cmdArgs, path, fs)).toEqual(path);
    });

    test('should return "too many arguments" if invalid flags exist', () => {
      const cmdArgs: string[] = ['-L', '', '-', 'asdf', '-P', 'L'];
      expect(pwd(cmdArgs, path, fs)).toEqual('pwd: too many arguments');
    });
  });

  describe('with valid flags containing -L', () => {
    test('should return logical path if -L flag is passed', () => {
      const cmdArgs: string[] = ['-L'];
      expect(pwd(cmdArgs, path, fs)).toEqual(
        './users/Tortle/documents/symlink'
      );
    });

    test('should return logical path if -L is last flag in array of valid flags', () => {
      const cmdArgs: string[] = ['-L', '', '-P', '-P', '', '-L'];
      expect(pwd(cmdArgs, path, fs)).toEqual(
        './users/Tortle/documents/symlink'
      );
    });
  });

  describe('with valid flags containing -P', () => {
    test('should return physical path if -P is last flag in array of valid flags', () => {
      const cmdArgs: string[] = ['-L', '', '-P', '-L', '-P'];
      expect(pwd(cmdArgs, path, fs)).toEqual('./users/Tortle/documents/test');
    });

    test('should return resolved path if -P flag is passed with symbolic path', () => {
      const cmdArgs: string[] = ['-P'];
      expect(pwd(cmdArgs, path, fs)).toEqual('./users/Tortle/documents/test');
    });

    test('should return same path if -P flag is passed with physical path', () => {
      const cmdArgs: string[] = ['-P'];
      const path = './users/Tortle/documents/test';
      expect(pwd(cmdArgs, path, fs)).toEqual('./users/Tortle/documents/test');
    });
  });
});
