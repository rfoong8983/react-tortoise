import { resolveDir } from './pathLib';
import { ValidFlags } from '../common/types';

export default function main(cmdArgs: string[], pwDir: string): string {
  if (!cmdArgs.length) return pwDir;
  const flags: ValidFlags = { '-L': '', '-P': '' };
  const validFlags = cmdArgs.every((f: string) => flags[f] !== undefined);
  if (!validFlags) return 'pwd: too many arguments';

  return resolveFlags(cmdArgs);

  // /valid/sym/apples
  //        sym => ./cats/whiskers
  // -L => /valid/sym/apples
  // -P => /
  function resolveFlags(flags: string[]) {
    let currPath: string = pwDir;
    let physPath: string | null = null;

    for (let i = 0; i < flags.length; i++) {
      // Fn only gets called if all flags are valid
      if (flags[i] === '-P') {
        if (!physPath) physPath = resolveDir(currPath);
        currPath = physPath;
      } else {
        currPath = pwDir;
      }
    }

    return currPath;
  }
}
