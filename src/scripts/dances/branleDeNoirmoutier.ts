import { easeCubic, easeCubicInOut } from "d3-ease";
import { periodic } from "@/scripts/sequences";
import { Dance, DancerMovement, DancerPosition } from "@/scripts/dance";

class Positions {
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

  toMovements() {
    const movements: DancerMovement[] = [];
    for (let i = 0; i < this.positions.length; i++) {
      const pos1 = this.positions[i];
      const pos2 = this.positions[(i + 1) % this.positions.length];
      movements.push(this.diffToBranle(pos1, pos2));
    }
    return periodic(movements);
  }
}

export const branleDeNoirmoutier = (nPairs: number): Dance => {
  const OFFSET = 0.5;
  const dance = Dance.empty();

  const branleDeNoirmoutierMovementX = Positions.new(
    DancerPosition.new({ x: 0, y: 0, r: 0, angle: 90 })
  )
    .step({ x: 1 })
    .step({ x: 1 })
    .step({ x: -1 })
    .step({ x: -1 })
    .step({ x: 1 })
    .step({ x: 1 })
    .step({ x: -1 })
    .step({ x: -1 })
    .step({ x: 1 })
    .step({ x: 1 })
    .step({ x: -1, angle: 180 })
    .step({ x: -1 })
    .step({ x: 1, angle: 180 })
    .step({ x: 1 })
    .step({ x: -1, angle: 180 });

  console.log(branleDeNoirmoutierMovementX.positions);

  const branleDeNoirmoutierMovement =
    branleDeNoirmoutierMovementX.toMovements();

  const shiftLeaders = (i: number): DancerPosition =>
    DancerPosition.new({
      x: -OFFSET,
      y: 0.5 * i,
      r: 0,
      angle: 0,
    });

  const shiftFollowers = (i: number): DancerPosition =>
    DancerPosition.new({
      x: +OFFSET,
      y: 0.5 * i,
      r: 0,
      angle: 180,
    });

  dance.generateDancers(
    branleDeNoirmoutierMovement,
    nPairs,
    shiftLeaders,
    (_) => 0
  );
  dance.generateDancers(
    branleDeNoirmoutierMovement,
    nPairs,
    shiftFollowers,
    (_) => 0
  );

  return dance;
};
