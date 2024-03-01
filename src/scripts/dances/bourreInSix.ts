import { easeCubic, easeCubicInOut } from "d3-ease";
import { periodic, periodicNormalize } from "@/scripts/sequences";
import { Dance, DancerMovement, DancerPosition } from "@/scripts/dance";

const branleX = periodicNormalize([
  (t) => 0.7 * easeCubic(t),
  (t) => 0.7 * (1 - easeCubic(t)),
]);

const branleXforward = periodicNormalize([
  (t) => easeCubic(t),
  (t) => 1 + easeCubic(t),
]);

const branleY = periodicNormalize([
  (t) => 0.5 * easeCubic(t),
  (t) => 0.5 + 0.5 * easeCubic(t),
]);

const branleR = (x: number) => Math.cos(2 * Math.PI * x);

const move1: DancerMovement = (t: number) =>
  DancerPosition.new({
    x: branleX(t) - 1,
    y: branleY(t),
    r: branleR(t),
    angle: 90,
  });

const move2: DancerMovement = (t: number) =>
  DancerPosition.new({
    x: branleX(t) - 1,
    y: branleY(t) + 1,
    r: branleR(t),
    angle: 90,
  });

const move3: DancerMovement = (t: number) =>
  DancerPosition.new({
    x: branleXforward(t) - 1,
    y: 2,
    r: branleR(t),
    angle: 90 - 180 * easeCubicInOut(t),
  });

const move4: DancerMovement = (t: number) =>
  DancerPosition.new({
    x: -branleX(t) + 1,
    y: 2 - branleY(t),
    r: branleR(t),
    angle: 270,
  });

const move5: DancerMovement = (t: number) =>
  DancerPosition.new({
    x: -branleX(t) + 1,
    y: 1 - branleY(t),
    r: branleR(t),
    angle: 270,
  });

const move6: DancerMovement = (t: number) =>
  DancerPosition.new({
    x: -branleXforward(t) + 1,
    y: 0,
    r: branleR(t),
    angle: 270 - 180 * easeCubicInOut(t),
  });

const part1 = periodic([move1, move2, move3, move4, move5, move6]);

export const bourreInSix = (): Dance => {
  const dance = Dance.empty();
  const dancer = part1;
  const shiftNext = (_: number): DancerPosition =>
    DancerPosition.new({
      x: 0,
      y: 0,
      r: 0,
      angle: 0,
    });
  dance.generateDancers(dancer, 6, shiftNext, (i) => i);
  dance.setSpeed(0.4);
  return dance;
};
