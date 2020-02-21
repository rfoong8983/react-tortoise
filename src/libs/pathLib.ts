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

function getPwdHistory(pwd: string): string[] {
  let pathHistory: string[] = [''];
  const pwdParts: string[] = pwd.split('/');

  pwdParts.forEach((path, idx) => {
    const toConcat = idx === 1 ? path : `/${path}`;
    pathHistory.push(pathHistory[pathHistory.length - 1].concat(toConcat));
  });

  return pathHistory;
}

export function getPhysicalPath(logicalPath: string, pwd: string): string {
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
    console.log('HISTORY:', pathHistory);
  }
  let parts: string[] = logicalPath.split('/');
  const pathParts: string[] = parts.filter((part: string) => part.length);

  console.log('INPUT:', logicalPath, pathParts, pathHistory);
  for (let directory of pathParts) {
    if (directory === '.') continue;
    // if directory gets all the way down to '', what about ./users/Tortle
    if (directory === '..') {
      pathHistory.pop();
      if (!pathHistory.length) pathHistory.push('/');
      continue;
    }

    let resolved;
    let prevPath = pathHistory[pathHistory.length - 1];
    let currPath = prevPath;
    currPath =
      prevPath === '/'
        ? currPath.concat(directory)
        : currPath.concat(`/${directory}`);
    console.log('CURR:', currPath, prevPath, directory);
    try {
      // try to resolve, then check if valid directory
      resolved = fs.readlinkSync(currPath);
      currPath =
        prevPath === '/'
          ? prevPath.concat(resolved)
          : prevPath.concat(`/${resolved}`);
    } catch (e) {
      console.log(`readlink "${directory}": NOT A SYMLINK`);
    }
    try {
      // check if valid directory, then try to resolve, then c
      console.log('RESOLVED PATH:', resolved, currPath);
      fs.readdirSync(currPath);
      // both a symlink and physlink
    } catch (e) {
      console.log(
        `readdir "${resolved || directory}": NOT SYMLINK OR DIRECTORY`
      );
      console.log('END:', '');
      // not a symlink or a valid directory
      return '';
    }

    pathHistory.push(currPath);
  }

  console.log('END:', pathHistory[pathHistory.length - 1]);
  return pathHistory[pathHistory.length - 1];
}
