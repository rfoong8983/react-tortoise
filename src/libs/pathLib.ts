const fs = window.require('fs');

export function resolveDir(p: string): string {
  let resolvedPath = p;
  console.log(p);
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

function getHardLink(path: string) {
  try {
    // try to resolve, then check if valid directory
    return fs.readlinkSync(path);
  } catch (e) {
    // console.log(`"${path}": NOT A SYMLINK`, e);
    return path;
  }
}

export function getPhysicalPath(logicalPath: string, pwd: string): string {
  // TODOS:
  // - Create a class for paths ?
  // - evaluate from most recent path?

  // split path
  // filter for blanks
  console.log(fs);
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

    let resolved;
    let prevPath = pathHistory[pathHistory.length - 1];
    let currPath = prevPath;
    currPath =
      prevPath === '/'
        ? currPath.concat(directory)
        : currPath.concat(`/${directory}`);
    console.log('currPath:', currPath);

    // try to resolve, then check if valid directory
    resolved = getHardLink(currPath);
    currPath =
      prevPath === '/'
        ? prevPath.concat(resolved)
        : prevPath.concat(`/${resolved}`);

    try {
      // check if valid directory, then try to resolve, then c
      fs.readdirSync(currPath);
    } catch (e) {
      console.log(
        `readdir "${resolved || directory}": NOT SYMLINK OR DIRECTORY`
      );
      // not a symlink or a valid directory
      return '';
    }

    pathHistory.push(currPath);
  }

  return pathHistory[pathHistory.length - 1];
}
