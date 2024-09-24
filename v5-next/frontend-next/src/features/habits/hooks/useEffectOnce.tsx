import { useRef, useEffect } from "react";

export const useEffectOnce = (callback: () => void) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    callback();
    hasRun.current = true;
  }, [callback]);
};
