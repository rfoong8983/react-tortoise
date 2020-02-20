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
