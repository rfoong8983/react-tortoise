/**
 * https://www.electronjs.org/docs/tutorial/application-architecture
 * https://stackoverflow.com/questions/55927086/jest-testing-electron-react-component-using-window-require
 * https://webpack.js.org/concepts/targets/
 * https://webpack.js.org/configuration/target/
 *
 * Electron uses chromium for displaying web pages. Each webpage in electron runs
 * in its own electron-renderer process. We want to configure webpack to compile
 * our app for usage in the electron-renderer process.
 *
 * Without this override, requiring node modules, specifically the fs module, will not work properly.
 */

module.exports = function override(config) {
  config.target = 'electron-renderer';
  return config;
};
