// __mocks__/fs.js
'use strict';

const path = require('path');
const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  // mockFiles = Object.create(null);
  for (const file of newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
}
// A custom version of `readlinkSync` that reads from the special mocked out
// file list set via __setMockFiles
function readlinkSync(path) {
  const parts = path.split('/');
  const curr = parts[parts.length - 1];
  if (path === './users/Tortle/documents/symlink') {
    return 'test';
  } else {
    return curr;
  }
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.readlinkSync = readlinkSync;

module.exports = fs;
