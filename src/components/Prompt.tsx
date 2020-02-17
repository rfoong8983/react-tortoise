import React, { useState } from 'react';
import './Prompt.css';

interface PromptProps {
  SetHistory: React.Dispatch<React.SetStateAction<string[]>>;
  History: string[];
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const response: string = validCommands(text);
    Props.SetHistory([...Props.History, response]);
    setText('');
  };

  return (
    <form className="prompt" onSubmit={handleSubmit}>
      <p className="prompt__marker">{Props.Path} $</p>
      <input className="prompt_input" onChange={handleChange} value={text} />
    </form>
  );
};

export default Prompt;
