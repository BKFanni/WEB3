import { createRouter, createWebHistory } from "vue-router";
import HandPlay from "./components/HandPlay.vue";
import GameSetup from "./components/GameSetup.vue";
import GameOver from "./components/GameOver.vue";

const routes = [
  {
    path: "/",
    name: "GameSetup",
    component: GameSetup,
  },
  {
    path: "/play",
    name: "Play",
    component: HandPlay,
  },
  {
    path: "/game-over",
    name: "GameOver",
    component: GameOver,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
