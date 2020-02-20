const fs = require('fs');

export function resolveDir(p: string): string {
  let resolvedPath = p;
  try {
    const resolved = fs.readlinkSync(p);
    const tmp = p.split('/');
    tmp.pop(); // pop off symlink
    tmp.push(resolved); // replace with physical link
    resolvedPath = tmp.join('/');
  } catch (e) {
    // resolvedPath = p;
  }
  console.log(resolvedPath, p);
  return resolvedPath;
}

export function getPhysicalPath(logicalPath: string, pwd: string): string {
  // TODO: Create a class for paths ?
  // split path
  // filter for blanks
  const pathHistory: string[] = [];
  let currPath = pwd;
  let parts: string[] = logicalPath.split('/');
  const pathParts: string[] = parts.filter((part: string) => part.length);
  // have variable to track current path during check
  for (let directory of pathParts) {
    if (directory === '.' && !pathHistory.length) {
      pathHistory.push('./');
      continue;
    }
    if (directory === '..') pathHistory.pop();
    // try to resolve, then check if valid directory
    // check if valid directory, then try to resolve, then c
    try {
      console.log(
        logicalPath,
        pathParts,
        pathHistory,
        currPath.concat(`/${directory}`),
        'first try'
      );
      fs.readlinkSync(currPath.concat(`/${directory}`));
    } catch (e) {
      console.log('first:', e);
    }
    try {
      console.log(
        logicalPath,
        pathParts,
        pathHistory,
        currPath.concat(`/${directory}`),
        'second try'
      );
      fs.readdirSync(currPath.concat(`/${directory}`));
      // both a symlink and physlink
    } catch (e) {
      console.log('second:', e);
      // not a symlink or a valid directory
      return '';
    }

    currPath = pathHistory[pathHistory.length - 1] + directory;
    pathHistory.push(currPath);
    // check for pointers at each part of path
  }

  console.log('hi', pathHistory[pathHistory.length - 1]);
  return pathHistory[pathHistory.length - 1];
}
