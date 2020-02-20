import React, { useState, SetStateAction } from 'react';
import { HistoryObject } from '../App';
import './Prompt.css';

interface PromptProps {
  setHistory: React.Dispatch<SetStateAction<HistoryObject[]>>;
  history: HistoryObject[];
  path: string;
  commands: (text: string) => string;
}

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
    if (val !== undefined) setText(val);
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!e.altKey && e.key === 'Enter') {
      const response: HistoryObject = {
        text,
        res: Props.commands(text),
        path: Props.path,
      };
      Props.setHistory([...Props.history, response]);
      setText('');
    }
  };

  return (
    <textarea
      className="prompt"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onKeyUp={handleSubmit}
      value={`${Props.path} $ ${text}`}
      wrap="soft"
    />
  );
};

export default Prompt;
