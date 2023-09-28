export interface DancerPosition {
  x: number;
  y: number;
  r: number;
  angle: number;
}

export type DancerMovement = (t: number) => DancerPosition;

export class Dance {
  dancers: DancerMovement[];
  constructor(dancers: DancerMovement[]) {
    this.dancers = dancers;
  }

  static empty(): Dance {
    return new Dance([]);
  }

  static new(dancers: DancerMovement[]): Dance {
    return new Dance(dancers);
  }

  generateDancers(
    firstDancer: DancerMovement,
    n: number,
    shiftPosition: (i: number) => DancerPosition,
    shiftTime: (i: number) => number
  ): Dance {
    const range = [...Array(n).keys()];
    const newDancers: DancerMovement[] = range.map((i) => {
      return (t: number) => {
        const ti = t + shiftTime(i);
        const pos0 = firstDancer(ti);
        const shifti = shiftPosition(i);
        return {
          x: pos0.x + shifti.x,
          y: pos0.y + shifti.y,
          r: pos0.r + shifti.r,
          angle: pos0.angle + shifti.angle,
        };
      };
    });
    this.dancers = this.dancers.concat(newDancers);
    return this;
  }
}
