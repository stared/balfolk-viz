<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { easeCubic, easeCubicInOut } from "d3-ease";
import { periodic } from "../scripts/sequences";
import Dancer from "./Dancer.vue";

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

const branleAnglePart2 = periodic([
  (_x) => 0,
  (x) => -180 * easeCubicInOut(x),
  (_x) => -180,
  (x) => -180 * (1 + easeCubicInOut(x)),
]);

const branleAngle = periodic([
  (_x) => 0,
  (_x) => 0,
  (x) => branleAnglePart2(4 * x),
  (x) => branleAnglePart2(4 * x),
]);

const x = computed(() => 300 + 200 * branleX(timeElapsed.value));
const radius = computed(() => 20 + 1 * branleR(timeElapsed.value));
const rotation = computed(() => 90 + branleAngle(timeElapsed.value / 4));
</script>

<template>
  <svg width="800" height="800">
    <Dancer :x="x" :y="200" :scale="radius" color="red" :rotation="rotation" />
  </svg>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
