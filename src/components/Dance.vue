<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { easeCubic, easeCubicInOut } from "d3-ease";
import { periodic } from "../scripts/sequences";
import Dancer from "./Dancer.vue";
import { Dance, DancerMovement, DancerPosition } from "../scripts/dance";

const timeStepMs = 10;
const timeElapsed = ref(0); // in seconds

let interval: number;

onMounted(() => {
  interval = setInterval(() => {
    timeElapsed.value += timeStepMs / 1000;
  }, timeStepMs);
});

onUnmounted(() => {
  clearInterval(interval);
});

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

const dance = Dance.empty();
const n = 10;
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
dance.generateDancers(firstLeader, n, shiftNext, (_) => 0);
dance.generateDancers(firstFollower, n, shiftNext, (_) => 0);
dance.setScaleShift(
  DancerPosition.new({ x: 200, y: 200, r: 1, angle: 1 }),
  DancerPosition.new({ x: 300, y: 0, r: 20, angle: 0 })
);

const dancers = computed(() => dance.render(timeElapsed.value));
</script>

<template>
  <svg width="800" height="800">
    <Dancer
      v-for="d in dancers"
      :x="d.x"
      :y="d.y"
      :scale="d.r"
      color="red"
      :rotation="d.angle"
    />
  </svg>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
