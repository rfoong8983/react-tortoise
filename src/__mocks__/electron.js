// __mocks__/fs.js
'use strict';

// const electron = jest.genMockFromModule('electron');
// console.log(electron);
// // electron.remote = jest.fn();
// // electron.require = jest.fn();
// // electron.app = jest.fn();
// // electron.dialog = jest.fn();
// // electron.match = jest.fn();

// module.exports = electron;

// export const electron = {
//   require: jest.fn(),
//   match: jest.fn(),
//   app: jest.fn(),
//   remote: jest.fn(),
//   shell: jest.fn(),
//   dialog: jest.fn(),
// };

export const remote = {
  getCurrentWindow: jest.fn(),
  dialog: jest.fn().mockImplementation(win => {
    showOpenDialog: jest.fn(win => win); // if a sub-module method is needed
  }),
  app: {
    getPath: jest.fn().mockReturnValue('/users/Ryan'),
  },
};

// for the shell module above
export const shell = {
  openExternal: jest.fn(),
};
