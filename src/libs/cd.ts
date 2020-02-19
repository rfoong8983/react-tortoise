const fs = window.require('fs');

export default function main(
  cmdArgs: string[],
  client: Electron.App,
  setPath: (path: string) => void
): void {
  // -L	force symbolic links to be followed
  // -P	use the physical directory structure without following symbolic

  const hasArgs: boolean = cmdArgs.length > 1;
  // no blocks means cd to home
  if (!hasArgs) {
    const home: string = client.getPath('home');
    setPath(home);
    // cd home
  } else {
    // process flags
  }
}
