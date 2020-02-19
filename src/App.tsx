import React, { useState } from 'react';
import Display from './components/Display';
import Prompt from './components/Prompt';
import './App.css';
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
    home + '/documents/desktop_application/terminal/symlink'
  );

  const commands = (text: string) => {
    // TODO: split commands and evaluate flags after (pwd -> -L/-P)
    // TODO: setup man page for pwd
    switch (text) {
      case 'hi':
      case 'hello':
        return 'hello to you too! 🐢';
      case 'pwd':
      case 'pwd -L':
        return path;
      case 'pwd -P':
        let resolvedPath;
        try {
          const resolved = fs.readlinkSync(path);
          const tmp = path.split('/');
          tmp.pop();
          tmp.push(resolved);
          resolvedPath = tmp.join('/');
        } catch (e) {
          console.log(e);
          resolvedPath = path;
        }
        return resolvedPath;
      default:
        return `tortoise: command not found: ${text}`;
    }
  };

  return (
    <div className="App">
      <Display history={history} path={path} />
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
