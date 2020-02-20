import { ValidFlags } from '../common/types';
const fs = window.require('fs');

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
  // checks if arg is flag, while flag keep applying flag
  // if not flag, tries to use as directory
  // if directory, stores directory, and checks for more
  // if no more, try navigating to directory
  // if more (1), search in pwd for new
  // else, return too many arguments

  const hasArgs: boolean = cmdArgs.length > 1;
  if (!hasArgs) {
    setPath(home);
    return home;
  }

  return '';
}
