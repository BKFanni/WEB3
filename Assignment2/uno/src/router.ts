import { createRouter, createWebHistory } from "vue-router";
import GameSetup from "./views/GameSetup.vue";
import PlayGame from "./views/PlayGame.vue";
import GameOver from "./views/GameOver.vue";

const routes = [
  { path: "/", name: "GameSetup", component: GameSetup },
  { path: "/play", name: "PlayGame", component: PlayGame },
  { path: "/game-over", name: "GameOver", component: GameOver },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
