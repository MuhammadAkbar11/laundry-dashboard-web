/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef } from 'react';

const useEffectRun = (
  callback: () => void,
  callbackReturn: () => void,
  dependencies: any[]
) => {
  const effRan = useRef(false);

  const dependenciesSpred = useMemo(() => [...dependencies], [dependencies]);
  useEffect(() => {
    if (effRan.current === true) {
      callback();
    }
    return () => {
      callbackReturn();
      effRan.current = true;
    };
  }, [callback, callbackReturn, dependenciesSpred]);
};

export default useEffectRun;
