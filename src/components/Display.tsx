import React from 'react';
import { HistoryObject } from '../App';
import './Display.css';

interface DisplayProps {
  History: HistoryObject[];
  Path: string;
}

const Display = (Props: DisplayProps) => {
  return (
    <div className="display">
      {Props.History.map((obj, idx) => {
        const { text, res } = obj;

        return (
          <div>
            <p className="prompt__marker">
              {Props.Path} $ {text}
            </p>
            <p key={idx}>{res}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Display;
