import React, { useState } from 'react';
import Display from './components/Display';
import Prompt from './components/Prompt';
import './App.css';
import { default as pwd } from './libs/pwd';
import { default as cd } from './libs/cd';
const { app } = window.require('electron').remote;
const home: string = app.getPath('home');

export interface HistoryObject {
  text: string;
  res: string;
  pwDir: string;
}

function App() {
  const [history, setHistory] = useState<HistoryObject[]>([]);
  const [pwDir, setPath] = useState<string>(home + '/documents/test');
  // const [pwDir, setPath] = useState<string>(home);

  const commands = (text: string): string => {
    // TODO: setup man page for pwd
    console.log(text);
    // let args: string[] = text.split('\ ')
    const args: string[] = text.split(' ');
    // args = text.split(' ');
    const cmdArgs: string[] = args.filter((arg: string) => arg.length);
    const cmd: string | undefined = cmdArgs.shift();

    switch (cmd) {
      case 'hi':
      case 'hello':
        return 'hello to you too! 🐢';
      case 'cd':
        return cd(cmdArgs, home, pwDir, setPath);
      case 'pwd':
        return pwd(cmdArgs, pwDir);
      default:
        return `tortoise: command not found: ${text}`;
    }
  };

  return (
    <div className="App">
      <Display history={history} />
      <Prompt
        history={history}
        setHistory={setHistory}
        pwDir={pwDir}
        commands={commands}
      />
    </div>
  );
}

export default App;
