import { easeCubic, easeCubicInOut } from "d3-ease";
import { periodic } from "../sequences";
import { Dance, DancerMovement, DancerPosition } from "../dance";

const branleX = periodic([
  (x) => easeCubic(x) - 1,
  (x) => easeCubic(x),
  (x) => 1 - easeCubic(x),
  (x) => -easeCubic(x),
]);

const branleR = (x: number) => Math.cos(2 * Math.PI * x);

const branleAnglePart2Leader = periodic([
  (_x) => 0,
  (x) => -180 * easeCubicInOut(x),
  (_x) => -180,
  (x) => -180 * (1 + easeCubicInOut(x)),
]);

const branleAngleLeader = periodic([
  (_x) => 0,
  (_x) => 0,
  (x) => branleAnglePart2Leader(4 * x),
  (x) => branleAnglePart2Leader(4 * x),
]);

export const branleDeNoirmoutier = (nPairs: number): Dance => {
  const dance = Dance.empty();
  const firstLeader: DancerMovement = (t: number) =>
    DancerPosition.new({
      x: branleX(t) - 0.5,
      y: 0,
      r: branleR(t),
      angle: 90 + branleAngleLeader(t / 4),
    });
  const firstFollower: DancerMovement = (t: number) =>
    DancerPosition.new({
      x: branleX(t) + 0.5,
      y: 0,
      r: branleR(t),
      angle: 270 + branleAngleLeader(t / 4 + 3.5),
    });
  const shiftNext = (i: number): DancerPosition =>
    DancerPosition.new({
      x: 0,
      y: 0.5 * i,
      r: 0,
      angle: 0,
    });
  dance.generateDancers(firstLeader, nPairs, shiftNext, (_) => 0);
  dance.generateDancers(firstFollower, nPairs, shiftNext, (_) => 0);
  return dance;
};
