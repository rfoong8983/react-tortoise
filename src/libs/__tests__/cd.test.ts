import { default as cd } from '../cd';
import fs from '../../__mocks__/fs';

describe('cd function', () => {
  const setPath = jest.fn();
  const path = './users/Ryan';
  const home = './users/Ryan';
  beforeAll(() => {
    fs.__setMockFiles(['users', 'Ryan', 'documents']);
    // symlink is a shortcut to resolvedLink, defined in fs mock
    fs.__setMockFiles([
      './users/Ryan/documents/test',
      './users/Ryan/documents/resolvedLink',
    ]);
    // ***** FIX SETMOCKFILES *****
  });

  test('should return root path if no args passed', () => {
    const cmdArgs: string[] = [];
    expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(home);
  });

  // filter blank
  // checks if arg is flag, while flag keep applying flag
  // if not flag, tries to use as directory
  // if directory, stores directory, and checks for more
  // if no more, try navigating to directory
  // if more (1), search in pwd for new
  // else, return too many arguments

  describe('with single argument', () => {
    test('should return home if arg is -L flag', () => {
      const cmdArgs: string[] = ['-L'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(home);
    });
    test('should return home if arg is -P flag', () => {
      const cmdArgs: string[] = ['-P'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(home);
    });
    test('should return path if valid directory (./path)', () => {
      console.log(fs.readlinkSync);
      const cmdArgs: string[] = ['./documents'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(path);
    });
    test('should return path if valid directory (/path)', () => {
      console.log(fs.readlinkSync);
      const cmdArgs: string[] = ['/documents'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(path);
    });
    test('should return path if valid directory (path)', () => {
      console.log(fs.readlinkSync);
      const cmdArgs: string[] = ['documents'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(path);
    });
  });

  describe('with multiple args', () => {
    test('with -L, should return logical path of destination if path is valid', () => {
      const cmdArgs: string[] = ['-L', 'documents/symlink'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
        './users/Tortle/documents/symlink'
      );
    });

    test('with -P, should return physical path of destination if path is valid', () => {
      const cmdArgs: string[] = ['-P', 'documents/symlink'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
        './users/Tortle/documents/resolvedLink'
      );
    });

    test('should handle single "." correctly', () => {
      const cmdArgs: string[] = ['-L', '.'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(path);
    });

    test('should handle multiple "." correctly', () => {
      const cmdArgs: string[] = ['-L', '././documents/.'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
        './users/Tortle/documents'
      );
    });

    test('should handle single ".." correctly', () => {
      const cmdArgs: string[] = ['-L', '..'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual('./users');
    });

    test('should handle multiple ".." correctly', () => {
      const cmdArgs: string[] = ['-L', '.././../users/Tortle'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual('./users/Tortle');
    });

    test('should return root directory when ".." is passed at root', () => {
      const path = '/';
      const cmdArgs: string[] = ['-L', '.././..'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual('/');
    });
  });

  describe('once there are no more valid flags (only -L & -P)', () => {
    describe('treat next arg as a directory if no other args after', () => {
      test('should detect invalid directories', () => {
        const cmdArgs: string[] = ['-L', '-P', '-L', '-A'];
        expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
          'cd: no such file or directory: -A'
        );
      });

      test('should return valid directories', () => {
        const cmdArgs: string[] = ['-L', '-P', '-L', 'documents'];
        expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
          './users/Tortle/documents'
        );
      });
    });

    describe('if only 2 additional args, try to replace str1 with str2 in current path', () => {
      test('should detect invalid directories', () => {
        const cmdArgs: string[] = ['-L', '-P', '-L', '-A'];
        expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
          'cd: no such file or directory: -A'
        );
      });

      test('should return valid directories', () => {
        const cmdArgs: string[] = ['-L', '-P', '-L', 'documents'];
        expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
          './users/Tortle/documents'
        );
      });
    });

    describe('if > 2 additional args', () => {
      test('return cd: too many arguments', () => {
        const cmdArgs: string[] = ['-L', '-P', '-L', 'documents', '.', '-L'];
        expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
          'cd: too many arguments'
        );
      });
    });
  });
});
