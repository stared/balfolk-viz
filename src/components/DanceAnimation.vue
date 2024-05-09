<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import DancerGlyph from "@/components/DancerGlyph.vue";
import { branleDeNoirmoutier } from "@/scripts/dances/branleDeNoirmoutier";
import { bourreInSix } from "@/scripts/dances/bourreInSix";
import { chapelloise } from "@/scripts/dances/chapelloise";
import { DancerPosition } from "@/scripts/dance";

const timeStepMs = 10;
const timeElapsed = ref(0); // in seconds
const selectedDance = ref("branleDeNoirmoutier");
const nPairs = 10;

let interval: ReturnType<typeof setTimeout>;

onMounted(() => {
  interval = setInterval(() => {
    timeElapsed.value += timeStepMs / 1000;
  }, timeStepMs);
});

onUnmounted(() => {
  clearInterval(interval);
});

const dances = {
  branleDeNoirmoutier: branleDeNoirmoutier(nPairs),
  bourreInSix: bourreInSix(),
  chapelloise: chapelloise(nPairs),
};
const dance = computed(() => {
  const danceKey = selectedDance.value as keyof typeof dances;
  const currentDance = dances[danceKey];
  currentDance.setScaleShift(
    DancerPosition.new({ x: 100, y: 100, r: 0.5, angle: 1 }),
    DancerPosition.new({ x: 300, y: 0, r: 20, angle: 0 })
  );
  return currentDance;
});

const dancers = computed(() => dance.value.render(timeElapsed.value));

watch(selectedDance, () => {
  timeElapsed.value = 0; // Reset time elapsed when dance changes
});
</script>

<template>
  <div>
    <select v-model="selectedDance">
      <option value="branleDeNoirmoutier">Branle de Noirmoutier</option>
      <option value="bourreInSix">Bourrée in Six</option>
      <option value="chapelloise">Chapelloise</option>
    </select>
    <svg width="800" height="800">
      <DancerGlyph
        v-for="(d, index) in dancers"
        :key="index"
        :x="d.x"
        :y="d.y"
        :scale="d.r"
        color="red"
        :rotation="d.angle"
      />
    </svg>
  </div>
</template>
