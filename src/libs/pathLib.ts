const fs = require('fs');

export function resolveDir(p: string): string {
  let resolvedPath = p;

  try {
    const resolved = fs.readlinkSync(p);
    const tmp = p.split('/');
    tmp.pop(); // pop off symlink
    tmp.push(resolved); // replace with physical link
    resolvedPath = tmp.join('/');
    return resolvedPath;
  } catch (e) {
    return p;
  }
}

function getPwdHistory(pwd: string): string[] {
  let pathHistory: string[] = [''];
  const pwdParts: string[] = pwd.split('/');

  pwdParts.forEach((path, idx) => {
    const toConcat = idx === 1 ? path : `/${path}`;
    pathHistory.push(pathHistory[pathHistory.length - 1].concat(toConcat));
  });

  return pathHistory;
}

export function getHardLink(path: string): string {
  try {
    // try to resolve, then check if valid directory
    const resolved = fs.readlinkSync(path);
    const tmp = path.split('/');
    tmp.pop(); // pop off symlink
    tmp.push(resolved); // replace with physical link
    return tmp.join('/');
  } catch (e) {
    // console.log(`"${path}": NOT A SYMLINK`, e);
    return path;
  }
}

function isValidPath(path: string): boolean {
  try {
    fs.readdirSync(path);
    return true;
  } catch (e) {
    // console.log(e, `readdir "${path}": NOT SYMLINK OR DIRECTORY`);
    return false;
  }
}

function buildPath(pathParts: string[]) {}

export function getPhysicalPath(
  logicalPath: string,
  pwd: string,
  getHardLinks: boolean
): string {
  // TODOS:
  // - Create a class for paths ?
  // - evaluate from most recent path?

  // split path
  // filter for blanks
  let pathHistory: string[] = [''];
  if (logicalPath[0] === '/') {
    pathHistory[0] = '/';
  } else {
    pathHistory = getPwdHistory(pwd);
  }
  let parts: string[] = logicalPath.split('/');
  const pathParts: string[] = parts.filter((part: string) => part.length);

  for (let directory of pathParts) {
    if (directory === '.') continue;
    // if directory gets all the way down to '', what about ./users/Tortle
    if (directory === '..') {
      pathHistory.pop();
      if (!pathHistory.length || pathHistory[pathHistory.length - 1] === '')
        pathHistory.push('/');
      continue;
    }

    let prevPath = pathHistory[pathHistory.length - 1];
    let currPath = prevPath;
    currPath =
      prevPath === '/'
        ? currPath.concat(directory)
        : currPath.concat(`/${directory}`);
    // try to resolve, then check if valid directory
    if (getHardLinks) currPath = getHardLink(currPath);
    if (!isValidPath(currPath)) return '';
    pathHistory.push(currPath);
  }

  return pathHistory[pathHistory.length - 1];
}
