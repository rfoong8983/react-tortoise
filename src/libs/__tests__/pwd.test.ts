import { default as pwd } from '../pwd';
// import fs from '../../__mocks__/fs';
jest.mock('fs');
// jest.mock('../pathLib');
// const { getHardLink } = require('../pathLib');

describe('pwd function', () => {
  const path = '/users/Tortle/documents/symlink';
  // beforeAll(() => {
  //   // symlink is a shortcut to resolvedLink, defined in fs mock
  //   fs.__setMockFiles([
  //     '/users/Tortle/documents/resolvedLink',
  //     '/users/Tortle/documents/symlink',
  //   ]);
  // });
  // afterAll(() => {
  //   fs.__setMockFiles([]);
  // });
  beforeAll(() => {
    // use if keeping track of call count to arg1
    // jest
    //   .spyOn(resolveDir, 'resolveDir')
    //   .mockImplementation(
    //     (p: string) => './users/Tortle/documents/resolvedLink'
    //   );
    // getHardLink.mockImplementation(
    //   (p: string) => './users/Tortle/documents/resolvedLink'
    // );
    console.log(
      require('fs').__setMockFiles([
        '/symlink',
        '/resolvedLink',
        '/symlink/asdf',
        '/resolvedLink/asdf',
        '/symlink/asdf/asdf',
        '/resolvedLink/asdf/asdf',
        '/users',
        '/users/Tortle',
        '/users/Tortle/documents',
        '/users/Tortle/documents/symlink',
        '/users/Tortle/documents/resolvedLink',
        '/users/Tortle/documents/symlink/asdf',
        '/users/Tortle/documents/resolvedLink/asdf',
        '/users/Tortle/documents/symlink/asdf/asdf',
        '/users/Tortle/documents/resolvedLink/asdf/asdf',
      ])
    );
  });

  describe('with no flags or invalid flags', () => {
    test('should return current path if no flags passed', () => {
      const cmdArgs: string[] = [];
      expect(pwd(cmdArgs, path)).toEqual(path);
    });

    test('should return "too many arguments" if invalid flags exist', () => {
      const cmdArgs: string[] = ['-L', '-', 'asdf', '-P', 'L'];
      expect(pwd(cmdArgs, path)).toEqual('pwd: too many arguments');
    });
  });

  describe('with valid flags containing -L', () => {
    test('should return logical path if -L flag is passed', () => {
      const cmdArgs: string[] = ['-L'];
      expect(pwd(cmdArgs, path)).toEqual('/users/Tortle/documents/symlink');
    });

    test('should return logical path if -L is last flag in array of valid flags', () => {
      const cmdArgs: string[] = ['-L', '-P', '-P', '-L'];
      expect(pwd(cmdArgs, path)).toEqual('/users/Tortle/documents/symlink');
    });
  });

  describe('with valid flags containing -P', () => {
    test('should return physical path if -P is last flag in array of valid flags', () => {
      const cmdArgs: string[] = ['-L', '-P', '-L', '-P'];
      expect(pwd(cmdArgs, path)).toEqual(
        '/users/Tortle/documents/resolvedLink'
      );
    });

    test('should return resolved path if -P flag is passed with symbolic path', () => {
      const cmdArgs: string[] = ['-P'];
      expect(pwd(cmdArgs, path)).toEqual(
        '/users/Tortle/documents/resolvedLink'
      );
    });

    test('should return same path if -P flag is passed with physical path', () => {
      const cmdArgs: string[] = ['-P'];
      const path = '/users/Tortle/documents/resolvedLink';
      expect(pwd(cmdArgs, path)).toEqual(
        '/users/Tortle/documents/resolvedLink'
      );
    });
  });
});
