// __mocks__/fs.js
'use strict';

const path = require('path');
const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles, reset) {
  if (reset) mockFiles = Object.create(null);
  for (const file of newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }

  return mockFiles;
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  // console.log('READING DIR:', mockFiles[directoryPath], directoryPath);
  if (mockFiles[directoryPath]) {
    return mockFiles[directoryPath];
  } else {
    throw new Error(`no such file or directory, scandir ${path}'`);
  }
}
// A custom version of `readlinkSync` that reads from the special mocked out
// file list set via __setMockFiles
function readlinkSync(path) {
  if (path === '/users/Tortle/documents/symlink' || path === '/symlink') {
    return 'resolvedLink';
  } else if (
    path === '/users/Tortle/documents/symlink spaces' ||
    path === '/symlink spaces'
  ) {
    return 'resolvedLink spaces';
  } else {
    throw new Error(`invalid argument, readlink '${path}'`);
  }
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.readlinkSync = readlinkSync;

module.exports = fs;
