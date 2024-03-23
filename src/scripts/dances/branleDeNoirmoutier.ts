import { easeCubic, easeCubicInOut } from "d3-ease";
import { periodic } from "@/scripts/sequences";
import { Dance, DancerMovement, DancerPosition } from "@/scripts/dance";

const branleX = periodic([
  (x) => easeCubic(x) - 1,
  (x) => easeCubic(x),
  (x) => 1 - easeCubic(x),
  (x) => -easeCubic(x),
]);

const branleR = (x: number) => Math.cos(2 * Math.PI * x);

const branleAnglePart2Leader = periodic([
  () => 0,
  (x) => -180 * easeCubicInOut(x),
  () => -180,
  (x) => -180 * (1 + easeCubicInOut(x)),
]);

const branleAngleLeader = periodic([
  () => 0,
  () => 0,
  (x) => branleAnglePart2Leader(4 * x),
  (x) => branleAnglePart2Leader(4 * x),
]);

const createDancerPosition = (
  t: number,
  xOffset: number,
  angleBase: number,
  angleOffset: number
): DancerPosition => {
  return DancerPosition.new({
    x: branleX(t) + xOffset,
    y: 0,
    r: branleR(t),
    angle: angleBase + branleAngleLeader(t / 4 - angleOffset),
  });
};

export const branleDeNoirmoutier = (nPairs: number): Dance => {
  const OFFSET = 0.5;
  const LEADER_ANGLE_BASE = 90;
  const FOLLOWER_ANGLE_BASE = 270;
  const dance = Dance.empty();

  const firstLeader: DancerMovement = (t: number) =>
    createDancerPosition(t, -OFFSET, LEADER_ANGLE_BASE, 0);
  const firstFollower: DancerMovement = (t: number) =>
    createDancerPosition(t, OFFSET, FOLLOWER_ANGLE_BASE, 0.5);

  const shiftNext = (i: number): DancerPosition =>
    DancerPosition.new({ x: 0, y: 0.5 * i, r: 0, angle: 0 });

  dance.generateDancers(firstLeader, nPairs, shiftNext, (_) => 0);
  dance.generateDancers(firstFollower, nPairs, shiftNext, (_) => 0);

  return dance;
};
