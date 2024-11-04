
<template>
  <div>
    <h1>Game Over</h1>
    <div v-for="(score, player) in scores" :key="player">
      {{ player }}: {{ score }}
    </div>
    <button @click="restartGame">Play Again</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue'; 
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const scores = computed(() => store.state.scores);

    const restartGame = () => {
      router.push('/');
    };

    return { scores, restartGame };
  },
};
</script>
