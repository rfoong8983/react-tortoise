import React from 'react';
import './Display.css';

interface DisplayProps {
  History: string[];
}

const Display = (Props: DisplayProps) => {
  return (
    <div className="display">
      {Props.History.map((cmd, idx) => {
        return <p key={idx}>{cmd}</p>;
      })}
    </div>
  );
};

export default Display;
