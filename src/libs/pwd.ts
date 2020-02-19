export default function main(
  cmdArgs: string[],
  path: string,
  setPath: (p: string) => void,
  fs: {
    readlinkSync: (path: string) => string;
    readdirSync: (path: string) => string[];
  }
): string {
  interface validFlags {
    [flag: string]: string;
  }

  if (!cmdArgs.length) return path;
  const flags: validFlags = { '-L': '', '-P': '' };
  const validFlags = cmdArgs.every((f: string) => flags[f] !== undefined);
  if (!validFlags) return 'pwd: too many arguments';

  return resolveFlags(cmdArgs);

  // helper functions
  function resolveDir(p: string): string {
    let resolvedPath;
    try {
      const resolved = fs.readlinkSync(p);
      const tmp = p.split('/');
      tmp.pop(); // pop off symlink
      tmp.push(resolved); // replace with physical link
      resolvedPath = tmp.join('/');
    } catch (e) {
      console.log(e);
      resolvedPath = p;
    }

    return resolvedPath;
  }

  // /valid/sym/apples
  //        sym => ./cats/whiskers
  // -L => /valid/sym/apples
  // -P => /
  function resolveFlags(flags: string[]) {
    let currPath: string = path;
    let physPath: string | null = null;

    for (let i = 0; i < flags.length; i++) {
      // Fn only gets called if all flags are valid
      if (flags[i] === '-P') {
        if (!physPath) physPath = resolveDir(currPath);
        currPath = physPath;
      } else {
        currPath = path;
      }
    }

    return currPath;
  }
}
