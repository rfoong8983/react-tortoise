import React, { useEffect, useRef } from 'react';
import { HistoryObject } from '../App';
import './Display.css';

interface DisplayProps {
  history: HistoryObject[];
  path: string;
}

const Display = (Props: DisplayProps) => {
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [Props.history.length]);

  return (
    <div className="display" ref={displayRef}>
      {Props.history.map((obj, idx) => {
        const { text, res } = obj;

        return (
          <div key={idx}>
            <p className="prompt__marker">
              {Props.path} $ {text}
            </p>
            <p>{res}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Display;
