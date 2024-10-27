import Vue from 'vue';
import Router from 'vue-router';
import GameLobby from './components/GameLobby.vue';
import Game from './components/Game.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GameLobby',
      component: GameLobby
    },
    {
      path: '/game/:gameId',
      name: 'Game',
      component: Game,
      props: true // This allows us to pass route params (like gameId) as props
    }
  ]
});
