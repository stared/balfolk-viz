<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import DancerGlyph from "@/components/DancerGlyph.vue";
import { branleDeNoirmoutier } from "@/scripts/dances/branleDeNoirmoutier";
import { bourreInSix } from "@/scripts/dances/bourreInSix";
import { chapelloise } from "@/scripts/dances/chapelloise";
import { DancerPosition } from "@/scripts/dance";

const route = useRoute();
const timeStepMs = 10;
const timeElapsed = ref(0); // in seconds
const nPairs = 10;
const isPlaying = ref(false); // Start paused
const isStepPlaying = ref(false); // Track if we're in a step animation

let interval: ReturnType<typeof setTimeout> | null = null;
let stepTimeout: ReturnType<typeof setTimeout> | null = null;

const startAnimation = () => {
  if (!interval) {
    interval = setInterval(() => {
      timeElapsed.value += timeStepMs / 1000;
    }, timeStepMs);
  }
  isPlaying.value = true;
};

const pauseAnimation = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  isPlaying.value = false;
};

const stepForward = () => {
  if (isStepPlaying.value) return; // Prevent multiple step animations

  isStepPlaying.value = true;
  const startTime = timeElapsed.value;

  // Start temporary animation
  interval = setInterval(() => {
    timeElapsed.value += timeStepMs / 1000;
  }, timeStepMs);

  // Stop after 1 second
  stepTimeout = setTimeout(() => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    isStepPlaying.value = false;
  }, 1000);
};

const resetAnimation = () => {
  timeElapsed.value = 0;
};

onMounted(() => {
  // Don't auto-start animation
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
  if (stepTimeout) {
    clearTimeout(stepTimeout);
  }
});

const dances = {
  "branle-de-noirmoutier": branleDeNoirmoutier(nPairs),
  "bourree-in-six": bourreInSix(),
  chapelloise: chapelloise(nPairs),
};

const dance = computed(() => {
  const danceKey = route.params.name as keyof typeof dances;
  const currentDance = dances[danceKey];
  if (!currentDance) {
    return dances["branle-de-noirmoutier"]; // fallback to default dance
  }
  currentDance.setScaleShift(
    DancerPosition.new({ x: 100, y: 100, r: 0.5, angle: 1 }),
    DancerPosition.new({ x: 300, y: 0, r: 20, angle: 0 })
  );
  return currentDance;
});

const dancers = computed(() => dance.value.render(timeElapsed.value));

watch(
  () => route.params.name,
  () => {
    timeElapsed.value = 0; // Reset time elapsed when dance changes
  }
);
</script>

<template>
  <div class="dance-view">
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
    <div class="controls">
      <button v-if="!isPlaying" @click="startAnimation" class="control-button">
        Play
      </button>
      <button v-if="isPlaying" @click="pauseAnimation" class="control-button">
        Pause
      </button>
      <button
        @click="stepForward"
        class="control-button"
        :class="{ 'control-button-disabled': isStepPlaying }"
        :disabled="isStepPlaying"
      >
        Step
      </button>
      <button @click="resetAnimation" class="control-button">Reset</button>
      <div>Step: {{ timeElapsed.toFixed(1) }}</div>
    </div>
  </div>
</template>

<style scoped>
.dance-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
}

.controls {
  display: flex;
  gap: 10px;
}

.control-button {
  padding: 8px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #42b883;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-button:hover:not(:disabled) {
  background-color: #3aa876;
}

.control-button:active:not(:disabled) {
  background-color: #359469;
}

.control-button-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
