import { resolveDir } from './pathLib';
import { ValidFlags } from '../common/types';

export default function main(
  cmdArgs: string[],
  path: string,
  fs: {
    readlinkSync: (path: string) => string;
    readdirSync: (path: string) => string[];
  }
): string {
  if (!cmdArgs.length) return path;
  const flags: ValidFlags = { '-L': '', '-P': '' };
  const validFlags = cmdArgs.every((f: string) => flags[f] !== undefined);
  if (!validFlags) return 'pwd: too many arguments';

  return resolveFlags(cmdArgs);

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
