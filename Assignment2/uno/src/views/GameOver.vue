<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-4xl font-bold text-blue-600 mb-8">Game Over</h1>
    
    <ul class="w-1/2 bg-white rounded-lg shadow-md p-4">
      <li 
        v-for="(score, player) in scores" 
        :key="player" 
        class="text-lg font-medium text-gray-700 mb-2"
      >
        Player {{ player + 1 }}: {{ score }} points
      </li>
    </ul>
    
    <button 
      @click="restartGame"
      class="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
    >
      Play Again
    </button>
  </div>
</template>

<script>
import { useGameStore } from '@/store/store';

export default {
  setup() {
    const gameStore = useGameStore();
    const scores = gameStore.scores;

    const restartGame = () => {
      gameStore.$reset();
    };

    return { scores, restartGame };
  },
};
</script>

