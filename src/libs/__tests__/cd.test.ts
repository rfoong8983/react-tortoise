import { default as cd } from '../cd';

// const getPhysicalPath = jest.fn().mockReturnValue('TESTING');

describe('cd function', () => {
  const setPath = jest.fn();
  const path = '/users/Tortle';
  const home = '/users/Tortle';

  beforeAll(() => {
    jest.mock('fs');
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
        '/symlink spaces',
        '/resolvedLink spaces',
        '/symlink spaces/asdf',
        '/resolvedLink spaces/asdf',
        '/symlink spaces/asdf/asdf',
        '/resolvedLink spaces/asdf/asdf',
      ])
    );
  });

  test('should return root path if no args passed', () => {
    const cmdArgs: string[] = [];
    expect(cd(cmdArgs, home, path, setPath)).toEqual(home);
  });

  // filter blank
  // checks if arg is flag, while flag keep applying flag
  // if not flag, tries to use as directory
  // if directory, stores directory, and checks for more
  // if no more, try navigating to directory
  // if more (1), search in pwd for new
  // else, return too many arguments

  //TODO: write tests to handle spaces, special chars might be handled by App.tsx
  describe('when arguments have special characters', () => {
    test('should correctly handle spaces', () => {
      const cmdArgs: string[] = ['/symlink spaces'];
      expect(cd(cmdArgs, home, path, setPath)).toEqual('/symlink spaces');
    });
  });

  describe('with only a flag argument', () => {
    test('should return home if arg is -L flag', () => {
      const cmdArgs: string[] = ['-L'];
      expect(cd(cmdArgs, home, path, setPath)).toEqual(home);
    });

    test('should return home if arg is -P flag', () => {
      const cmdArgs: string[] = ['-P'];
      expect(cd(cmdArgs, home, path, setPath)).toEqual(home);
    });

    // TODO: move to pathLib.test.ts

    // test('should return path if valid directory (./path)', () => {
    //   const cmdArgs: string[] = ['./documents/symlink'];
    //   expect(cd(cmdArgs, home, path, setPath)).toEqual(path);
    // });

    // test('should return path if valid directory (/path)', () => {
    //   const cmdArgs: string[] = ['/documents/symlink'];
    //   expect(cd(cmdArgs, home, path, setPath)).toEqual(path);
    // });

    // test('should return path if valid directory (path)', () => {
    //   const cmdArgs: string[] = ['documents/symlink'];
    //   expect(cd(cmdArgs, home, path, setPath)).toEqual(path);
    // });
  });

  // TODO: move to pathLib.test.ts

  // describe('with multiple args', () => {
  //   test('with -L, should return logical path of destination if path is valid', () => {
  //     const cmdArgs: string[] = ['-L', 'documents/symlink'];
  //     expect(cd(cmdArgs, home, path, setPath)).toEqual(
  //       './users/Tortle/documents/symlink'
  //     );
  //   });

  //   test('with -P, should return physical path of destination if path is valid', () => {
  //     const cmdArgs: string[] = ['-P', 'documents/symlink'];
  //     expect(cd(cmdArgs, home, path, setPath)).toEqual(
  //       './users/Tortle/documents/resolvedLink'
  //     );
  //   });

  //   test('should handle single "." correctly', () => {
  //     const cmdArgs: string[] = ['-L', '.'];
  //     expect(cd(cmdArgs, home, path, setPath)).toEqual(path);
  //   });

  //   test('should handle multiple "." correctly', () => {
  //     const cmdArgs: string[] = ['-L', '././documents/.'];
  //     expect(cd(cmdArgs, home, path, setPath)).toEqual(
  //       './users/Tortle/documents'
  //     );
  //   });

  //   test('should handle single ".." correctly', () => {
  //     const cmdArgs: string[] = ['-L', '..'];
  //     expect(cd(cmdArgs, home, path, setPath)).toEqual('./users');
  //   });

  //   test('should handle multiple ".." correctly', () => {
  //     const cmdArgs: string[] = ['-L', '.././../users/Tortle'];
  //     expect(cd(cmdArgs, home, path, setPath)).toEqual('./users/Tortle');
  //   });

  //   test('should return root directory when ".." is passed at root', () => {
  //     const path = '/';
  //     const cmdArgs: string[] = ['-L', '.././..'];
  //     expect(cd(cmdArgs, home, path, setPath)).toEqual('/');
  //   });
  // });

  describe('once there are no more valid flags (only -L & -P)', () => {
    describe('treat next arg as a directory if no other args after', () => {
      test('should detect invalid directories', () => {
        const cmdArgs: string[] = ['-L', '-P', '-L', '-A'];
        expect(cd(cmdArgs, home, path, setPath)).toEqual(
          'cd: no such file or directory: -A'
        );
      });

      test('should return valid directories', () => {
        const cmdArgs: string[] = ['-L', '-P', '-L', 'documents'];
        expect(cd(cmdArgs, home, path, setPath)).toEqual(
          './users/Tortle/documents'
        );
      });
    });

    describe('if only 2 additional args, try to replace str1 with str2 in current path', () => {
      test('should detect invalid directories', () => {
        const cmdArgs: string[] = ['-L', '-P', '-L', '-A'];
        expect(cd(cmdArgs, home, path, setPath)).toEqual(
          'cd: no such file or directory: -A'
        );
      });

      test('should return valid directories', () => {
        const cmdArgs: string[] = ['-L', '-P', '-L', 'documents'];
        expect(cd(cmdArgs, home, path, setPath)).toEqual(
          './users/Tortle/documents'
        );
      });
    });

    describe('if > 2 additional args', () => {
      test('return cd: too many arguments', () => {
        const cmdArgs: string[] = ['-L', '-P', '-L', 'documents', '.', '-L'];
        expect(cd(cmdArgs, home, path, setPath)).toEqual(
          'cd: too many arguments'
        );
      });
    });
  });
});
