import { default as cd } from '../cd';
const fs = require('../../__mocks__/fs');
jest.mock('../pathLib');
const { getPhysicalPath } = require('../pathLib');
// getPhysicalPath.mockImplementation((logicalPath: string, pwd: string) => {
//   const splitPath = logicalPath.split('/');
//   const dir = splitPath.slice(0, splitPath.length - 1).join('/');
//   fs.readdirSync(mockDirectory, dir);
// });

describe('cd function', () => {
  const setPath = jest.fn();
  const path = './users/Tortle';
  const home = './users/Tortle';
  let mockDirectory: object;
  beforeAll(() => {
    fs.__setMockFiles(['users', './users/Tortle', './users/Tortle/documents']);
    // symlink is a shortcut to resolvedLink, defined in fs mock
    mockDirectory = fs.__setMockFiles([
      './users/Tortle/documents/symlink',
      './users/Tortle/documents/resolvedLink',
    ]);
    // console.log('MOCK FILES:', mockDirectory);

    // getPhysicalPath.mockImplementation((logicalPath: string, pwd: string) => {
    //   const splitPath = logicalPath.split('/');
    //   const dir = splitPath.slice(0, splitPath.length - 1).join('/');
    //   fs.readdirSync(mockDirectory, dir);
    // });
    jest.mock('../../__mocks__/fs');
  });
  afterAll(() => {
    fs.__setMockFiles([], true);
    // console.log('MOCK FILES CLEANUP: ', fs.__setMockFiles([], true));
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

  describe('with only a flag argument', () => {
    test('should return home if arg is -L flag', () => {
      const cmdArgs: string[] = ['-L'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(home);
    });

    test('should return home if arg is -P flag', () => {
      const cmdArgs: string[] = ['-P'];
      expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(home);
    });

    // TODO: move to pathLib.test.ts

    // test('should return path if valid directory (./path)', () => {
    //   const cmdArgs: string[] = ['./documents/symlink'];
    //   expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(path);
    // });

    // test('should return path if valid directory (/path)', () => {
    //   const cmdArgs: string[] = ['/documents/symlink'];
    //   expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(path);
    // });

    // test('should return path if valid directory (path)', () => {
    //   const cmdArgs: string[] = ['documents/symlink'];
    //   expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(path);
    // });
  });

  // TODO: move to pathLib.test.ts

  // describe('with multiple args', () => {
  //   test('with -L, should return logical path of destination if path is valid', () => {
  //     const cmdArgs: string[] = ['-L', 'documents/symlink'];
  //     expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
  //       './users/Tortle/documents/symlink'
  //     );
  //   });

  //   test('with -P, should return physical path of destination if path is valid', () => {
  //     const cmdArgs: string[] = ['-P', 'documents/symlink'];
  //     expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
  //       './users/Tortle/documents/resolvedLink'
  //     );
  //   });

  //   test('should handle single "." correctly', () => {
  //     const cmdArgs: string[] = ['-L', '.'];
  //     expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(path);
  //   });

  //   test('should handle multiple "." correctly', () => {
  //     const cmdArgs: string[] = ['-L', '././documents/.'];
  //     expect(cd(cmdArgs, home, path, setPath, fs)).toEqual(
  //       './users/Tortle/documents'
  //     );
  //   });

  //   test('should handle single ".." correctly', () => {
  //     const cmdArgs: string[] = ['-L', '..'];
  //     expect(cd(cmdArgs, home, path, setPath, fs)).toEqual('./users');
  //   });

  //   test('should handle multiple ".." correctly', () => {
  //     const cmdArgs: string[] = ['-L', '.././../users/Tortle'];
  //     expect(cd(cmdArgs, home, path, setPath, fs)).toEqual('./users/Tortle');
  //   });

  //   test('should return root directory when ".." is passed at root', () => {
  //     const path = '/';
  //     const cmdArgs: string[] = ['-L', '.././..'];
  //     expect(cd(cmdArgs, home, path, setPath, fs)).toEqual('/');
  //   });
  // });

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
