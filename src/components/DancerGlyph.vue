<template>
  <path
    :d="trianglePath"
    :fill="props.color"
    :transform="`translate(${props.x},${props.y}) scale(${
      props.scale / 50
    }) rotate(${props.rotation} 50 50)`"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  scale: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
}>();

// Define the triangle path (equilateral triangle for simplicity)
const trianglePath = computed(() => {
  return "M 50 10 L 10 90 L 90 90 Z";
});
</script>
