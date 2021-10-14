export const clamp = (v: number, max: number, min = 0) => Math.min(Math.max(v, min), max);

export function lerp(a: number, b: number, delta: number) {
  return a + (b - a) * delta;
}
