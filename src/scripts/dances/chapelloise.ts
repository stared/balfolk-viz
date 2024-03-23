import { easeCubicInOut } from "d3-ease";
import { periodic, periodicNormalize } from "@/scripts/sequences";
import { Dance, DancerMovement, DancerPosition } from "@/scripts/dance";

const chapelloiseX = periodic([
  (x) => easeCubicInOut(x),
  (x) => 1 - easeCubicInOut(x),
  (x) => -easeCubicInOut(x),
  (x) => easeCubicInOut(x) - 1,
]);

const chapelloiseY = periodic([
  (_x) => 0,
  (x) => easeCubicInOut(x),
  (_x) => 1,
  (x) => 1 - easeCubicInOut(x),
]);

const chapelloiseAngle = periodicNormalize([
  (x) => 90 * x,
  (x) => 90 + 90 * x,
  (x) => 180 + 90 * x,
  (x) => 270 + 90 * x,
]);

export const chapelloise = (nPairs: number): Dance => {
  const dance = Dance.empty();

  const firstLeader: DancerMovement = (t: number) =>
    DancerPosition.new({
      x: chapelloiseX(t / 4),
      y: chapelloiseY(t / 4),
      r: 1,
      angle: chapelloiseAngle(t / 4),
    });

  const firstFollower: DancerMovement = (t: number) =>
    DancerPosition.new({
      x: chapelloiseX(t / 4 - 0.5),
      y: chapelloiseY(t / 4 - 0.5),
      r: 1,
      angle: chapelloiseAngle(t / 4 - 0.5),
    });

  const shiftNext = (i: number): DancerPosition =>
    DancerPosition.new({
      x: 2 * (i % 2),
      y: Math.floor(i / 2),
      r: 0,
      angle: 0,
    });

  dance.generateDancers(firstLeader, nPairs, shiftNext, (_) => 0);
  dance.generateDancers(firstFollower, nPairs, shiftNext, (_) => 0);

  return dance;
};
