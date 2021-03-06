import React, { useState } from 'react';
import Display from './components/Display';
import Prompt from './components/Prompt';
import './App.css';
import { default as pwd } from './libs/pwd';
const fs = window.require('fs');
const { app } = window.require('electron').remote;
const home: string = app.getPath('home');

export interface HistoryObject {
  text: string;
  res: string;
}

function App() {
  const [history, setHistory] = useState<HistoryObject[]>([]);
  const [path, setPath] = useState<string>(
    home + '/documents/desktop_application/symlink'
  );

  const commands = (text: string) => {
    // TODO: setup man page for pwd
    const cmdArgs: string[] = text.split(' ');
    let cmd: string | undefined = cmdArgs.shift();

    while (!cmd) {
      cmd = cmdArgs.shift();
    }

    switch (cmd) {
      case 'hi':
      case 'hello':
        return 'hello to you too! 🐢';
      case 'pwd':
        return pwd(cmdArgs, path, fs);
      default:
        return `tortoise: command not found: ${text}`;
    }
  };

  return (
    <div className="App">
      <Display History={history} Path={home} />
      <Prompt History={history} SetHistory={setHistory} Path={home} />
    </div>
  );
}

export default App;
