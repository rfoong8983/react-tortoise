import { getPhysicalPath } from './pathLib';
import { ValidFlags } from '../common/types';

export default function main(
  cmdArgs: string[],
  home: string,
  path: string,
  setPath: (path: string) => void,
  fs: {
    readlinkSync: (path: string) => string;
    readdirSync: (path: string) => string[];
  }
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
  for (let i = 0; i < cmdArgs.length; i++) {
    const arg = cmdArgs[i];
    if (flags[arg] !== undefined) {
      currFlag = arg;
      continue;
    }

    // [0, 1, 2, 3, 4]
    const remaining = cmdArgs.length - i;
    if (remaining > 2) return 'cd: too many arguments';
    if (remaining === 2) {
      // try to replace string1 in path with string2
      // return string not in <string1> or replaced result
    }
    if (remaining < 2) {
      // apply currFlag, change directory
      // currFlag = -P, try resolve directory
      const resolved = getPhysicalPath(cmdArgs[i], path);
      setPath(resolved);
      return resolved;
      // check directory
      // change directory (setPath, return)
    }
  }
  // console.log('hi');
  setPath(home);
  return home;
}
