import { getPhysicalPath } from './pathLib';
import { ValidFlags } from '../common/types';

export default function main(
  cmdArgs: string[],
  home: string,
  pwDir: string,
  setPath: (path: string) => void
): string {
  const flags: ValidFlags = { '-L': '', '-P': '' };
  const hasArgs: boolean = cmdArgs.length > 0;
  // checks if arg is flag, while flag keep applying flag
  // if not flag, tries to use as directory
  // if directory, stores directory, and checks for more
  // if no more, try navigating to directory
  // if more (1), search in pwd for new
  // else, return too many arguments

  // need function to evaluate path

  if (!hasArgs) {
    setPath(home);
    return home;
  }

  let currFlag = '-L';
  let partialArg = '';
  for (let i = 0; i < cmdArgs.length; i++) {
    let arg = cmdArgs[i];
    if (flags[arg] !== undefined) {
      currFlag = arg;
      continue;
    }

    // console.log('ARG:', arg);
    const lastChar = arg[arg.length - 1];
    if (lastChar === '\\') {
      if (partialArg.length) partialArg = partialArg.concat(' ');
      partialArg = partialArg.concat(arg.slice(0, -1));
      continue;
    } else if (partialArg.length) {
      arg = partialArg.concat(` ${arg}`);
      partialArg = '';
      // console.log('PARTIAL:', arg);
    }

    const remaining = cmdArgs.length - i;
    if (remaining > 2) return 'cd: too many arguments';
    if (remaining === 2) {
      // try to replace string1 in path with string2
      // return string not in <string1> or replaced result
    }
    if (remaining < 2) {
      // TODO: return path if not -P !!!!
      const resolved =
        currFlag === '-P'
          ? getPhysicalPath(arg, pwDir, true)
          : getPhysicalPath(arg, pwDir, false);

      if (!resolved) return `cd: no such file or directory: ${arg}`;
      console.log(resolved);
      setPath(resolved);
      return resolved;
    }
  }

  setPath(home);
  return home;
}
