import React, { useState } from 'react';
import Display from './components/Display';
import Prompt from './components/Prompt';
import './App.css';
const { app } = window.require('electron').remote;
const home: string = app.getPath('home');

export interface HistoryObject {
  text: string;
  res: string;
}

function App() {
  const [history, setHistory] = useState<HistoryObject[]>([]);
  const [path, setPath] = useState<string>(home);

  return (
    <div className="App">
      <Display History={history} Path={home} />
      <Prompt History={history} SetHistory={setHistory} Path={home} />
    </div>
  );
}

export default App;
