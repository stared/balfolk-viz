export interface IDancerPosition {
  x: number;
  y: number;
  r: number;
  angle: number;
}

export class DancerPosition {
  x: number;
  y: number;
  r: number;
  angle: number;
  constructor(x: number, y: number, r: number, angle: number) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.angle = angle;
  }

  static new(dancerPos: IDancerPosition): DancerPosition {
    const { x, y, r, angle } = dancerPos;
    return new DancerPosition(x, y, r, angle);
  }

  shift(shift: DancerPosition): DancerPosition {
    return DancerPosition.new({
      x: this.x + shift.x,
      y: this.y + shift.y,
      r: this.r + shift.r,
      angle: this.angle + shift.angle,
    });
  }
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
        const shifti = shiftPosition(i);
        return firstDancer(ti).shift(shifti);
      };
    });
    this.dancers = this.dancers.concat(newDancers);
    return this;
  }
}
