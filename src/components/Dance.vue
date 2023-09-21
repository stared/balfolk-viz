<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { easeCubic } from "d3-ease";
import { periodic } from "../scripts/sequences";

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

const x = computed(() => 300 + 200 * branleX(timeElapsed.value));
const radius = computed(() => 20 + 1 * branleR(timeElapsed.value));
</script>

<template>
  <svg width="800" height="800">
    <circle
      :cx="x"
      :cy="200"
      :r="radius"
      stroke="black"
      stroke-width="3"
      fill="red"
    />
  </svg>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
