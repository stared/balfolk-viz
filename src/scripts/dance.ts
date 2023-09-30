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

  /**
   * Zero, i.e. the neutral shift.
   * @returns
   */
  static noShift(): DancerPosition {
    return DancerPosition.new({ x: 0, y: 0, r: 0, angle: 0 });
  }

  /**
   * One, i.e. the neutral scaling.
   * @returns
   */
  static noScale(): DancerPosition {
    return DancerPosition.new({ x: 1, y: 1, r: 1, angle: 1 });
  }

  /**
   * Add coordinates of two objects.
   * @param shift
   * @returns A new object.
   */
  shift(shift: DancerPosition): DancerPosition {
    return DancerPosition.new({
      x: this.x + shift.x,
      y: this.y + shift.y,
      r: this.r + shift.r,
      angle: this.angle + shift.angle,
    });
  }

  /**
   * Multiply coordinates of two objects.
   * @param shift
   * @returns A new object.
   */
  scale(scale: DancerPosition): DancerPosition {
    return DancerPosition.new({
      x: this.x * scale.x,
      y: this.y * scale.y,
      r: this.r * scale.r,
      angle: this.angle * scale.angle,
    });
  }
}

export type DancerMovement = (t: number) => DancerPosition;

export class Dance {
  dancers: DancerMovement[];
  scale: DancerPosition;
  shift: DancerPosition;
  constructor(
    dancers: DancerMovement[],
    scale: DancerPosition,
    shift: DancerPosition
  ) {
    this.dancers = dancers;
    this.scale = scale;
    this.shift = shift;
  }

  static new(dancers: DancerMovement[]): Dance {
    return new Dance(
      dancers,
      DancerPosition.noScale(),
      DancerPosition.noShift()
    );
  }

  static empty(): Dance {
    return Dance.new([]);
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

  /**
   * Set scale for rendering. The scale is aplied before the shift.
   * @param scale Multiply dimensions by these numbers.
   * @param shift Add dimensions by these numbers.
   * @returns The same object (for chaining).
   */
  setScaleShift(scale: DancerPosition, shift: DancerPosition) {
    this.scale = scale;
    this.shift = shift;
    return this;
  }

  /**
   * Create positions of dancers at a given time, and according to the scale.
   * @param t Time
   * @returns
   */
  render(t: number): DancerPosition[] {
    return this.dancers.map((d) => d(t).scale(this.scale).shift(this.shift));
  }
}
