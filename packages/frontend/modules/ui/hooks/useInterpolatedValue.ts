import { clamp, lerp } from "modules/lang/number";
import { useRef } from "react";
import { useAnimation } from "./useAnimation";

export function useInterpolatedValue(target: number, callback: (value: number) => void, scale = 5) {
  const currentTimeRef = useRef(0);
  const valueRef = useRef(target);

  useAnimation(() => {
    const frameTime = Date.now();
    const deltaTime = (frameTime - currentTimeRef.current) / 1000;
    currentTimeRef.current = frameTime;

    // a large delta value means the UI was stalled for a long time
    // so we don't want to animate anything if that happens
    if (deltaTime > 0.5) return;

    valueRef.current = lerp(valueRef.current, target, clamp(deltaTime * scale, 1, 0));
    callback(valueRef.current);
  });
}
