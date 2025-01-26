<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const dances = [
  { name: "Branle de Noirmoutier", path: "/dance/branle-de-noirmoutier" },
  { name: "Bourrée in Six", path: "/dance/bourree-in-six" },
  { name: "Chapelloise", path: "/dance/chapelloise" },
];
</script>

<template>
  <div class="app">
    <nav class="nav-bar">
      <router-link
        v-for="dance in dances"
        :key="dance.path"
        :to="dance.path"
        class="nav-link"
        :class="{ active: route.path === dance.path }"
      >
        {{ dance.name }}
      </router-link>
    </nav>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.nav-bar {
  background-color: #2c3e50;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #34495e;
}

.nav-link.active {
  background-color: #42b883;
}

main {
  flex: 1;
  padding: 1rem;
}
</style>
