<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import Dancer from "./Dancer.vue";
import { DancerPosition } from "../scripts/dance";
import { branleDeNoirmoutier } from "../scripts/dances/branleDeNoirmoutier";

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

const nPairs = 10;
const dance = branleDeNoirmoutier(nPairs);
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
