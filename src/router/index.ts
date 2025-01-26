import { createRouter, createWebHistory } from "vue-router";
import DanceView from "@/views/DanceView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/dance/branle-de-noirmoutier",
    },
    {
      path: "/dance/:name",
      name: "dance",
      component: DanceView,
    },
  ],
});

export default router;
