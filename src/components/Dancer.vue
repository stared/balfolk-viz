<template>
  <path
    :d="trianglePath"
    :fill="props.color"
    :transform="`translate(${props.x},${props.y}) rotate(${props.rotation} 50 50)`"
  />
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps({
  scale: {
    type: Number,
    default: 1,
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: "#000",
  },
  rotation: {
    type: Number,
    default: 0,
  },
});

// Define the triangle path (equilateral triangle for simplicity)
const trianglePath = computed(() => {
  return "M 50 10 L 10 90 L 90 90 Z";
});
</script>
