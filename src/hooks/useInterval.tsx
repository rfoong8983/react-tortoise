import { useEffect, useRef } from 'react';

export default function useInterval(callback: () => void, delay: number) {
  interface cb {
    current: Function;
  }
  const cb: cb = {
    current: () => {},
  };
  const savedCallback = useRef(() => {});

  // Remember the latest callback.
  useEffect(() => {
    if (savedCallback.current) savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
