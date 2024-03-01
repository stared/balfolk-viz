/**
 * n mod m (as built-in gives negative numbers)
 * @param n
 * @param m
 * @returns
 */
const mod = (n: number, m: number): number => ((n % m) + m) % m;

/**
 * Turn an array of R->anything functions in a piecewise periodic sequence.
 * @param arr Array of piecewise
 * @returns
 */
export const periodic = <T>(arr: Array<(x: number) => T>) => {
  return (t: number) => {
    const piece = mod(Math.floor(t), arr.length);
    return arr[piece](t % 1);
  };
};

export const periodicNormalize = <T>(arr: Array<(x: number) => T>) => {
  return (t: number) => {
    const n = arr.length;
    const piece = mod(Math.floor(n * t), n);
    return arr[piece]((n * t) % 1);
  };
};
