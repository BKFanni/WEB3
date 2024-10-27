import { createRouter, createWebHistory } from 'vue-router';
import GameLobby from './components/GameLobby.vue';
import Login from './components/LogIn.vue';
import UnoGame from './components/UnoGame.vue'
import RegisterUser from './components/RegisterUser.vue';

const routes = [
  {
    path: '/',
    name: 'GameLobby',
    component: GameLobby,
    meta: { requiresAuth: true } // Protect this route
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'RegisterUser',
    component: RegisterUser
  },
  {
    path: '/game/:gameId',
    name: 'UnoGame',
    component: UnoGame,
    meta: { requiresAuth: true }, // Protect this route
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to check for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next();
  }
});

export default router;
