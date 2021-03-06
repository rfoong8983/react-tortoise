// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { remote } from './__mocks__/electron';

global.window.require = function() {
  return {
    fs: jest.mock('fs'),
    remote: { app: remote.app },
  };
};
