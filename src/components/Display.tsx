import React, { useEffect, useRef } from 'react';
import { HistoryObject } from '../App';
import './Display.css';

interface DisplayProps {
  History: HistoryObject[];
  Path: string;
}

const Display = (Props: DisplayProps) => {
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [Props.History.length]);

  return (
    <div className="display" ref={displayRef}>
      {Props.History.map((obj, idx) => {
        const { text, res } = obj;

        return (
          <div key={idx}>
            <p className="prompt__marker">
              {Props.Path} $ {text}
            </p>
            <p>{res}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Display;
