<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import DancerGlyph from "@/components/DancerGlyph.vue";
import { branleDeNoirmoutier } from "@/scripts/dances/branleDeNoirmoutier";
import { bourreInSix } from "@/scripts/dances/bourreInSix";
import { chapelloise } from "@/scripts/dances/chapelloise";
import { DancerPosition } from "@/scripts/dance";

const route = useRoute();
const timeElapsed = ref(0); // in seconds
const nPairs = 10;
const isPlaying = ref(false);
const isStepPlaying = ref(false);

let animationFrameId: number | null = null;
let lastTimestamp: number | null = null;

const animate = (timestamp: number) => {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }

  const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
  timeElapsed.value += deltaTime;
  lastTimestamp = timestamp;

  if (isPlaying.value) {
    animationFrameId = requestAnimationFrame(animate);
  }
};

const startAnimation = () => {
  if (!isPlaying.value) {
    isPlaying.value = true;
    lastTimestamp = null;
    animationFrameId = requestAnimationFrame(animate);
  }
};

const pauseAnimation = () => {
  isPlaying.value = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  lastTimestamp = null;
};

const stepForward = () => {
  if (isStepPlaying.value) return;

  isStepPlaying.value = true;
  const targetTime = Math.floor(timeElapsed.value + 1);

  const stepAnimate = (timestamp: number) => {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    timeElapsed.value += deltaTime;
    lastTimestamp = timestamp;

    if (timeElapsed.value < targetTime) {
      animationFrameId = requestAnimationFrame(stepAnimate);
    } else {
      timeElapsed.value = targetTime; // Ensure we land exactly on the target
      isStepPlaying.value = false;
      lastTimestamp = null;
    }
  };

  animationFrameId = requestAnimationFrame(stepAnimate);
};

const resetAnimation = () => {
  pauseAnimation();
  timeElapsed.value = 0;
};

onMounted(() => {
  // Don't auto-start animation
});

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
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
const dancersWithRoles = computed(() =>
  dancers.value.map((dancer, index) => ({
    ...dancer,
    role: dance.value.roles[index],
  }))
);

const roleColors = {
  leader: "#E62B4F", // bright red
  follower: "#2B83E6", // bright blue
  neutral: "#2BE665", // bright green
} as const;

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
        v-for="(d, index) in dancersWithRoles"
        :key="index"
        :x="d.x"
        :y="d.y"
        :scale="d.r"
        :color="roleColors[d.role]"
        :rotation="d.angle"
      />
    </svg>
    <div class="controls">
      <div class="buttons">
        <button
          v-if="!isPlaying"
          @click="startAnimation"
          class="control-button"
        >
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
      </div>
      <div class="step-counter">Step: {{ timeElapsed.toFixed(1) }}</div>
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
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.buttons {
  display: flex;
  gap: 10px;
}

.step-counter {
  text-align: center;
  margin-top: 5px;
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
