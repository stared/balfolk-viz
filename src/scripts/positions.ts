import { easeCubic, easeCubicInOut } from "d3-ease";
import { mod, periodic } from "@/scripts/sequences";
import { DancerMovement, DancerPosition } from "@/scripts/dance";

export default class Positions {
  positions: DancerPosition[];

  constructor(positions: DancerPosition[]) {
    this.positions = positions;
  }

  static new(initialPosition: DancerPosition) {
    return new Positions([initialPosition]);
  }

  step({ x = 0, y = 0, angle = 0 }) {
    const oldPosition = this.positions[this.positions.length - 1];
    const newPosition = DancerPosition.new({
      x: oldPosition.x + x,
      y: oldPosition.y + y,
      r: oldPosition.r, // for now, let's assume it's constant
      angle: (oldPosition.angle + angle) % 360,
    });
    this.positions.push(newPosition);
    return this;
  }

  diffToBranle(pos1: DancerPosition, pos2: DancerPosition): DancerMovement {
    return (t: number) =>
      DancerPosition.new({
        x: pos1.x + easeCubic(t) * (pos2.x - pos1.x),
        y: pos1.y + easeCubic(t) * (pos2.y - pos1.y),
        r: pos1.r * Math.cos(2 * Math.PI * t),
        angle: pos1.angle + easeCubicInOut(t) * (pos2.angle - pos1.angle),
      });
  }

  toMovements(): DancerMovement {
    console.log(this.positions);
    const movements: DancerMovement[] = [];
    for (let i = 0; i < this.positions.length; i++) {
      const pos1 = this.positions[i];
      const pos2 = this.positions[(i + 1) % this.positions.length];
      movements.push(this.diffToBranle(pos1, pos2));
    }
    return periodic(movements);
  }

  toMovementsWithShift({ x = 0, y = 0, angle = 0 }): DancerMovement {
    const movements: DancerMovement[] = [];
    for (let i = 0; i < this.positions.length; i++) {
      const pos1 = this.positions[i];
      const pos2 = this.positions[(i + 1) % this.positions.length];
      movements.push(this.diffToBranle(pos1, pos2));
    }
    return (t: number) => {
      const piece = mod(Math.floor(t), movements.length);
      const cycles = mod(Math.floor(t / movements.length), movements.length);
      const shift = DancerPosition.new({
        x: x * cycles,
        y: y * cycles,
        r: 0,
        angle: angle * cycles,
      });
      return movements[piece](t % 1).shift(shift);
    };
  }
}
