import { useEffect, useRef } from "react";

export const useAnimation = (frame: () => void, enabled = true) => {
  const frameRef = useRef<number>();
  const frameCallbackRef = useRef(frame);

  useEffect(() => {
    frameCallbackRef.current = frame;
  });

  useEffect(() => {
    const frameHandler = () => {
      frameCallbackRef.current();
      frameRef.current = requestAnimationFrame(frameHandler);
    };

    if (enabled) {
      frameHandler();
    }

    return () => {
      cancelAnimationFrame(frameRef.current as number);
    };
  }, [enabled]);
};
