import React, { useState } from 'react';
import Display from './components/Display';
import Prompt from './components/Prompt';
import './App.css';
import { default as pwd } from './libs/pwd';
import { default as cd } from './libs/cd';
const fs = window.require('fs');
const { app } = window.require('electron').remote;
const home: string = app.getPath('home');

export interface HistoryObject {
  text: string;
  res: string;
  path: string;
}

function App() {
  const [history, setHistory] = useState<HistoryObject[]>([]);
  const [path, setPath] = useState<string>(home + '/documents');

  const commands = (text: string): string => {
    // TODO: setup man page for pwd
    const args: string[] = text.split(' ');
    const cmdArgs: string[] = args.filter((arg: string) => arg.length);
    const cmd: string | undefined = cmdArgs.shift();

    switch (cmd) {
      case 'hi':
      case 'hello':
        return 'hello to you too! 🐢';
      case 'cd':
        return cd(cmdArgs, home, path, setPath, fs);
      case 'pwd':
        return pwd(cmdArgs, path, fs);
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
        path={path}
        commands={commands}
      />
    </div>
  );
}

export default App;
