jest.mock('fs');
import { getPhysicalPath } from '../pathLib';

const setPath = jest.fn();
const pwd = '/users/Tortle';
const home = '/users/Tortle';

//TODO: write tests for directories with spaces

describe('getPhysicalPath', () => {
  beforeAll(() => {
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
    // symlink is a shortcut to resolvedLink, defined in fs mock
  });

  describe('with -L flag set', () => {
    const getHardLinks = false;

    describe('paths prepended with /', () => {
      test('should return an empty string if invalid directory (/path)', () => {
        const logicalPath: string = '/documents/symlink';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
      });
      test('should return an empty string if invalid directory (/path, has spaces)', () => {
        const logicalPath: string = '/documents/symlink not real';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
      });

      test('should return logical path if valid directory (/path)', () => {
        const logicalPath: string = '/symlink';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
          '/symlink'
        );
      });

      test('should return logical path if valid directory (/path, has spaces)', () => {
        const logicalPath: string = '/symlink spaces';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
          '/symlink spaces'
        );
      });

      describe('with a single . in path', () => {
        test('should return an empty string if invalid directory (/./path)', () => {
          const logicalPath: string = '/./documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (/path/.)', () => {
          const logicalPath: string = '/documents/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (/./path)', () => {
          const logicalPath: string = '/./symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
        test('should return logical path if valid directory (/path/.)', () => {
          const logicalPath: string = '/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
      });

      describe('with multiple . in path', () => {
        test('should return an empty string if invalid directory (/././path)', () => {
          const logicalPath: string = '/././documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (/path/./.)', () => {
          const logicalPath: string = '/documents/symlink/./.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (/./path/.)', () => {
          const logicalPath: string = '/./documents/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (/././path)', () => {
          const logicalPath: string = '/././symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
        test('should return logical path if valid directory (/path/.)', () => {
          const logicalPath: string = '/symlink/./.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
        test('should return logical path if valid directory (/./path/.)', () => {
          const logicalPath: string = '/./symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
      });

      describe('with a single .. in path', () => {
        test('should return root directory already at root (/..)', () => {
          const logicalPath: string = '/..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('/');
        });
        test('should return an empty string if invalid directory (/../path)', () => {
          const logicalPath: string = '/../documents/cookies';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (/path/..)', () => {
          const logicalPath: string = '/documents/symlink/..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (/../path)', () => {
          const logicalPath: string = '/../symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
        test('should return logical path if valid directory (/path/..)', () => {
          const logicalPath: string = '/symlink/asdf/..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
      });

      describe('with multiple .. in path', () => {
        test('should return root directory already at root (/../path/../../..)', () => {
          const logicalPath: string = '/../users/Tortle/../../../..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('/');
        });
        test('should return an empty string if invalid directory (/../../path)', () => {
          const logicalPath: string = '/../../users/../documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (/../../path)', () => {
          const logicalPath: string = '/../../symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
        test('should return logical path if valid directory (/path/../..)', () => {
          const logicalPath: string = '/../symlink/asdf/../../symlink/';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
        test('should return logical path if valid directory (/../path/../path)', () => {
          const logicalPath: string = '/../symlink/../symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
      });
    });

    describe('paths prepended with ./', () => {
      test('should return an empty string if invalid directory (./path)', () => {
        const logicalPath: string = './documents/applesauce';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
      });

      test('should return logical path if valid symlink (./path)', () => {
        const logicalPath: string = './documents/symlink';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
          '/users/Tortle/documents/symlink'
        );
      });

      describe('with a single . in path (not including ./)', () => {
        test('should return an empty string if invalid directory (././path)', () => {
          const logicalPath: string = '././crisscross/';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (./path/.)', () => {
          const logicalPath: string = './crisscross/applesauce/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (././path)', () => {
          const logicalPath: string = '././documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/symlink'
          );
        });
        test('should return logical path if valid directory (./path/.)', () => {
          const logicalPath: string = './documents/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/symlink'
          );
        });
      });

      describe('with multiple . in path', () => {
        test('should return an empty string if invalid directory (./././path)', () => {
          const logicalPath: string = './././bananas/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (./path/./.)', () => {
          const logicalPath: string = './crisscross/symlink/./.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (././path/.)', () => {
          const logicalPath: string = '././applesauce/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (./././path)', () => {
          const logicalPath: string = './././documents/symlink/';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/symlink'
          );
        });
        test('should return logical path if valid directory (./path/.)', () => {
          const logicalPath: string = './documents/symlink/./.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/symlink'
          );
        });
        test('should return logical path if valid directory (./path/./path/.)', () => {
          const logicalPath: string = './documents/./symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/symlink'
          );
        });
      });

      describe('with a single .. in path', () => {
        test('should return an empty string if invalid directory (./../path)', () => {
          const logicalPath: string = './../documents/cookies';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });

        test('should return logical path if valid directory (./path/..)', () => {
          const logicalPath: string = './documents/symlink/asdf/..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/symlink'
          );
        });
      });

      describe('with multiple .. in path', () => {
        test('should return root directory already at root (./../path/../../..)', () => {
          const logicalPath: string = './../Tortle/../../../..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('/');
        });
        test('should return an empty string if invalid directory (./../../path/../path)', () => {
          const logicalPath: string = './../../users/../documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (./../../path)', () => {
          const logicalPath: string = './../../symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
        test('should return logical path if valid directory (./../../path/../../path)', () => {
          const logicalPath: string = './../../symlink/asdf/../../symlink/';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/symlink'
          );
        });
      });
    });

    describe('paths not prepended', () => {
      test('should return an empty string if invalid directory (./path)', () => {
        const logicalPath: string = 'documents/applesauce';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
      });

      test('should return logical path if valid symlink (path)', () => {
        const logicalPath: string = 'documents/symlink';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
          '/users/Tortle/documents/symlink'
        );
      });

      describe('with a single . in path', () => {
        test('should return an empty string if invalid directory (path/./path)', () => {
          const logicalPath: string = 'apples/./symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (path/.)', () => {
          const logicalPath: string = 'oranges/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (path/.)', () => {
          const logicalPath: string = 'documents/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/symlink'
          );
        });
      });

      describe('with multiple . in path', () => {
        test('should return an empty string if invalid directory (path/./.)', () => {
          const logicalPath: string = 'cowspots/././';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (path/./.)', () => {
          const logicalPath: string = 'documents/symlink/././';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/symlink'
          );
        });
      });

      describe('with a single .. in path', () => {
        test('should return an empty string if invalid directory (../path)', () => {
          const logicalPath: string = '../documents/cookies';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (path/..)', () => {
          const logicalPath: string = 'documents/..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle'
          );
        });
      });

      describe('with multiple .. in path', () => {
        test('should return root directory already at root (../../..)', () => {
          const logicalPath: string = '../../../..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('/');
        });
        test('should return root directory already at root (path/../../..)', () => {
          const logicalPath: string = 'documents/../../../../../..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('/');
        });
        test('should return an empty string if invalid directory (path/../../..)', () => {
          const logicalPath: string = 'asdf/../';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return logical path if valid directory (path/../../..)', () => {
          const logicalPath: string =
            'documents/symlink/../../documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/symlink'
          );
        });
      });
    });
  });

  /** TESTING -P FLAG */

  describe('with -P flag set', () => {
    const getHardLinks = true;

    describe('paths prepended with /', () => {
      test('should return an empty string if invalid directory (/path)', () => {
        const logicalPath: string = '/documents/symlink';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
      });

      test('should return physical path if valid directory (/path)', () => {
        const logicalPath: string = '/symlink';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
          '/resolvedLink'
        );
      });

      describe('with a single . in path', () => {
        test('should return an empty string if invalid directory (/./path)', () => {
          const logicalPath: string = '/./documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (/path/.)', () => {
          const logicalPath: string = '/documents/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (/./path)', () => {
          const logicalPath: string = '/./symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
        test('should return physical path if valid directory (/path/.)', () => {
          const logicalPath: string = '/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
      });

      describe('with multiple . in path', () => {
        test('should return an empty string if invalid directory (/././path)', () => {
          const logicalPath: string = '/././documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (/path/./.)', () => {
          const logicalPath: string = '/documents/symlink/./.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (/./path/.)', () => {
          const logicalPath: string = '/./documents/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (/././path)', () => {
          const logicalPath: string = '/././symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
        test('should return physical path if valid directory (/path/.)', () => {
          const logicalPath: string = '/symlink/./.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
        test('should return physical path if valid directory (/./path/.)', () => {
          const logicalPath: string = '/./symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
      });

      describe('with a single .. in path', () => {
        test('should return root directory already at root (/..)', () => {
          const logicalPath: string = '/..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('/');
        });
        test('should return an empty string if invalid directory (/../path)', () => {
          const logicalPath: string = '/../documents/cookies';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (/path/..)', () => {
          const logicalPath: string = '/documents/symlink/..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (/../path)', () => {
          const logicalPath: string = '/../symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
        test('should return physical path if valid directory (/path/..)', () => {
          const logicalPath: string = '/symlink/asdf/..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
      });

      describe('with multiple .. in path', () => {
        test('should return root directory already at root (/../path/../../..)', () => {
          const logicalPath: string = '/../users/Tortle/../../../..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('/');
        });
        test('should return an empty string if invalid directory (/../../path)', () => {
          const logicalPath: string = '/../../users/../documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (/../../path)', () => {
          const logicalPath: string = '/../../symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
        test('should return physical path if valid directory (/path/../..)', () => {
          const logicalPath: string = '/../symlink/asdf/../../symlink/';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
        test('should return physical path if valid directory (/../path/../path)', () => {
          const logicalPath: string = '/../symlink/../symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
      });
    });

    describe('paths prepended with ./', () => {
      test('should return an empty string if invalid directory (./path)', () => {
        const logicalPath: string = './documents/applesauce';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
      });

      test('should return physical path if valid symlink (./path)', () => {
        const logicalPath: string = './documents/symlink';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
          '/users/Tortle/documents/resolvedLink'
        );
      });

      describe('with a single . in path (not including ./)', () => {
        test('should return an empty string if invalid directory (././path)', () => {
          const logicalPath: string = '././crisscross/';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (./path/.)', () => {
          const logicalPath: string = './crisscross/applesauce/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (././path)', () => {
          const logicalPath: string = '././documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/resolvedLink'
          );
        });
        test('should return physical path if valid directory (./path/.)', () => {
          const logicalPath: string = './documents/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/resolvedLink'
          );
        });
      });

      describe('with multiple . in path', () => {
        test('should return an empty string if invalid directory (./././path)', () => {
          const logicalPath: string = './././bananas/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (./path/./.)', () => {
          const logicalPath: string = './crisscross/symlink/./.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (././path/.)', () => {
          const logicalPath: string = '././applesauce/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (./././path)', () => {
          const logicalPath: string = './././documents/symlink/';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/resolvedLink'
          );
        });
        test('should return physical path if valid directory (./path/.)', () => {
          const logicalPath: string = './documents/symlink/./.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/resolvedLink'
          );
        });
        test('should return physical path if valid directory (./path/./path/.)', () => {
          const logicalPath: string = './documents/./symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/resolvedLink'
          );
        });
      });

      describe('with a single .. in path', () => {
        test('should return an empty string if invalid directory (./../path)', () => {
          const logicalPath: string = './../documents/cookies';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });

        test('should return physical path if valid directory (./path/..)', () => {
          const logicalPath: string = './documents/symlink/asdf/..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/resolvedLink'
          );
        });
      });

      describe('with multiple .. in path', () => {
        test('should return root directory already at root (./../path/../../..)', () => {
          const logicalPath: string = './../Tortle/../../../..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('/');
        });
        test('should return an empty string if invalid directory (./../../path/../path)', () => {
          const logicalPath: string = './../../users/../documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (./../../path)', () => {
          const logicalPath: string = './../../symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
        test('should return physical path if valid directory (./../../path/../../path)', () => {
          const logicalPath: string = './../../symlink/asdf/../../symlink/';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/resolvedLink'
          );
        });
      });
    });

    describe('paths not prepended', () => {
      test('should return an empty string if invalid directory (./path)', () => {
        const logicalPath: string = 'documents/applesauce';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
      });

      test('should return physical path if valid symlink (path)', () => {
        const logicalPath: string = 'documents/symlink';
        expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
          '/users/Tortle/documents/resolvedLink'
        );
      });

      describe('with a single . in path', () => {
        test('should return an empty string if invalid directory (path/./path)', () => {
          const logicalPath: string = 'apples/./symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return an empty string if invalid directory (path/.)', () => {
          const logicalPath: string = 'oranges/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (path/.)', () => {
          const logicalPath: string = 'documents/symlink/.';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/resolvedLink'
          );
        });
      });

      describe('with multiple . in path', () => {
        test('should return an empty string if invalid directory (path/./.)', () => {
          const logicalPath: string = 'cowspots/././';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (path/./.)', () => {
          const logicalPath: string = 'documents/symlink/././';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/resolvedLink'
          );
        });
      });

      describe('with a single .. in path', () => {
        test('should return an empty string if invalid directory (../path)', () => {
          const logicalPath: string = '../documents/cookies';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (path/..)', () => {
          const logicalPath: string = 'documents/..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle'
          );
        });
      });

      describe('with multiple .. in path', () => {
        test('should return root directory already at root (../../..)', () => {
          const logicalPath: string = '../../../..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('/');
        });
        test('should return root directory already at root (path/../../..)', () => {
          const logicalPath: string = 'documents/../../../../../..';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('/');
        });
        test('should return an empty string if invalid directory (path/../../..)', () => {
          const logicalPath: string = 'asdf/../';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual('');
        });
        test('should return physical path if valid directory (path/../../..)', () => {
          const logicalPath: string =
            'documents/symlink/../../documents/symlink';
          expect(getPhysicalPath(logicalPath, pwd, getHardLinks)).toEqual(
            '/users/Tortle/documents/resolvedLink'
          );
        });
      });
    });
  });
});