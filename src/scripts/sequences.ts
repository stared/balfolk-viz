/**
 * Turn an array of R->R functions in a periodic sequence.
 * @param arr Array of piecewise
 * @returns
 */
export const periodic = (arr: Array<(x: number) => number>) => {
  return (t: number) => arr[Math.floor(t) % arr.length](t % 1);
};
