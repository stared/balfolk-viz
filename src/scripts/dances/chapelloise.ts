import Positions from "@/scripts/positions";
import { Dance, DancerPosition } from "@/scripts/dance";

export const chapelloise = (nPairs: number): Dance => {
  const dance = Dance.empty();

  // we need something position-based for any dances with swapping
  const firstLeader = Positions.new(
    DancerPosition.new({ x: -0.5, y: 5, r: 0, angle: 0 })
  )
    .step({ y: -1 })
    .step({ y: -1 })
    .step({ y: -1, angle: 180 })
    .step({ y: -1 })
    .step({ y: 1 })
    .step({ y: 1 })
    .step({ y: 1, angle: 180 })
    .step({ y: 1 })
    .step({ x: 0.5 })
    .step({ x: -0.5 })
    .step({ x: 1 })
    .step({ x: -0.5 })
    .step({ x: 0.5 })
    .step({ x: -1 })
    .toMovements();

  const firstFollower = Positions.new(
    DancerPosition.new({ x: 0.5, y: 5, r: 0, angle: 0 })
  )
    .step({ y: -1 })
    .step({ y: -1 })
    .step({ y: -1, angle: 180 })
    .step({ y: -1 })
    .step({ y: 1 })
    .step({ y: 1 })
    .step({ y: 1, angle: 180 })
    .step({ y: 1 })
    .step({ x: +0.5 })
    .step({ x: 0.5 })
    .step({ x: -1 })
    .step({ x: 0.5 })
    .step({ x: +0.5 })
    .step({ x: 1, y: -1 })
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
