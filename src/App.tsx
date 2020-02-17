import React, { useState } from 'react';
import Display from './components/Display';
import Prompt from './components/Prompt';
import './App.css';
const { app } = window.require('electron').remote;
const home: string = app.getPath('home');

function App() {
  const [history, setHistory] = useState<string[]>([]);
  const [path, setPath] = useState<string>(home);
  console.log(history);

  return (
    <div className="App">
      <Display History={history} />
      <Prompt History={history} SetHistory={setHistory} Path={home} />
    </div>
  );
}

export default App;
