<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import DancerGlyph from "@/components/DancerGlyph.vue";
import { branleDeNoirmoutier } from "@/scripts/dances/branleDeNoirmoutier";
import { DancerPosition } from "@/scripts/dance";
// import { bourreInSix } from "@/scripts/dances/bourreInSix";

const timeStepMs = 10;
const timeElapsed = ref(0); // in seconds

let interval: ReturnType<typeof setTimeout>;

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
// const dance = bourreInSix();
dance.setScaleShift(
  DancerPosition.new({ x: 200, y: 200, r: 1, angle: 1 }),
  DancerPosition.new({ x: 300, y: 0, r: 20, angle: 0 })
);

const dancers = computed(() => dance.render(timeElapsed.value));
</script>

<template>
  <svg width="800" height="800">
    <DancerGlyph
      v-for="d in dancers"
      :x="d.x"
      :y="d.y"
      :scale="d.r"
      color="red"
      :rotation="d.angle"
    />
  </svg>
</template>
