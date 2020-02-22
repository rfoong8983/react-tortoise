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

<<<<<<< Updated upstream
function getHardLink(path: string): string {
=======
export function getHardLink(path: string): string {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
function isValidPath(path: string): boolean {
=======
export function isValidPath(path: string): boolean {
  console.log('FS:', fs.__setMockFiles);
>>>>>>> Stashed changes
  try {
    fs.readdirSync(path);
    return true;
  } catch (e) {
    console.log(e, `readdir "${path}": NOT SYMLINK OR DIRECTORY`);
    return false;
  }
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
    console.log('currPath:', prevPath, currPath);

    // try to resolve, then check if valid directory
    // currPath = getHardLink(currPath);
    console.log('resolved:', prevPath, currPath);
    try {
      const resolved = fs.readlinkSync(currPath);
      const tmp = currPath.split('/');
      tmp.pop(); // pop off symlink
      tmp.push(resolved); // replace with physical link
      return tmp.join('/');
    } catch (e) {}

    try {
      fs.readdirSync(currPath);
    } catch (e) {
      console.log(e, `readdir "${currPath}": NOT SYMLINK OR DIRECTORY`);
      return '';
    }
    // if (!isValidPath(currPath)) return '';
    pathHistory.push(currPath);
  }

  return pathHistory[pathHistory.length - 1];
}
