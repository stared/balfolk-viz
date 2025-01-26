import Positions from "@/scripts/positions";
import { Dance, DancerPosition } from "@/scripts/dance";

export const branleDeNoirmoutier = (nPairs: number): Dance => {
  const dance = Dance.empty();

  const firstLeader = Positions.new(
    DancerPosition.new({ x: -0.5, y: 0, r: 0, angle: 270 })
  )
    .step({ x: 1, angle: 180 })
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
    .step({ x: -1, angle: 180 })
    .toMovements();

  const firstFollower = Positions.new(
    DancerPosition.new({ x: +0.5, y: 0, r: 0, angle: 270 })
  )
    .step({ x: 1, angle: 180 })
    .step({ x: 1 })
    .step({ x: -1, angle: 180 })
    .step({ x: -1 })
    .step({ x: 1 })
    .step({ x: 1 })
    .step({ x: -1 })
    .step({ x: -1 })
    .step({ x: 1 })
    .step({ x: 1 })
    .step({ x: -1 })
    .step({ x: -1 })
    .step({ x: 1, angle: 180 })
    .step({ x: 1 })
    .step({ x: -1, angle: 180 })
    .toMovements();

  const shiftLeaders = (i: number): DancerPosition =>
    DancerPosition.new({
      x: 0,
      y: 0.5 * i,
      r: 0,
      angle: 0,
    });

  const shiftFollowers = (i: number): DancerPosition =>
    DancerPosition.new({
      x: 0,
      y: 0.5 * i,
      r: 0,
      angle: 0,
    });

  dance.generateDancers(firstLeader, "leader", nPairs, shiftLeaders, (_) => 0);
  dance.generateDancers(
    firstFollower,
    "follower",
    nPairs,
    shiftFollowers,
    (_) => 0
  );

  return dance;
};
