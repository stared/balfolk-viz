<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { easeCubic } from "d3-ease";

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

const x = computed(() => 200 + 200 * easeCubic((timeElapsed.value / 2) % 1));
const radius = computed(() => 30 + 1 * Math.sin(8 * timeElapsed.value));
</script>

<template>
  <svg width="500" height="500">
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
