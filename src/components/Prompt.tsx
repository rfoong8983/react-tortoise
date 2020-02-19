import React, { useState, SetStateAction } from 'react';
import { HistoryObject } from '../App';
import './Prompt.css';

interface PromptProps {
  SetHistory: React.Dispatch<SetStateAction<HistoryObject[]>>;
  History: HistoryObject[];
  Path: string;
}

// const validCommands = { hello: 'hello to you too! 🐢' };
const validCommands = (text: string) => {
  switch (text) {
    case 'hi':
    case 'hello':
      return 'hello to you too! 🐢';
    default:
      return `tortoise: command not found: ${text}`;
  }
};

const Prompt = (Props: PromptProps) => {
  const [text, setText] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    // console.log('meta:', e.metaKey);
    // console.log('ctrl:', e.ctrlKey);
    // console.log('alt:', e.altKey);
    // console.log('shift:', e.shiftKey);
    if (e.key === 'Enter') {
      if (e.altKey) {
        setText(text + '\n');
      } else {
        e.preventDefault();
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const val = e.target.value.split(' $ ')[1];
    if (val) setText(val);
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!e.altKey && e.key === 'Enter') {
      const response: HistoryObject = { text, res: validCommands(text) };
      Props.SetHistory([...Props.History, response]);
      setText('');
    }
  };

  return (
    <textarea
      className="prompt"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onKeyUp={handleSubmit}
      value={`${Props.Path} $ ${text}`}
      wrap="soft"
    />
  );
};

export default Prompt;
