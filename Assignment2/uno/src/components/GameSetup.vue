<template>
  <div>
    <h1>Uno Game Setup</h1>
    <label>
      Number of Bots:
      <input type="number" v-model="numBots" min="1" max="3" />
    </label>
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ref } from 'vue'; 
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const numBots = ref(1);

    const startGame = () => {
      const players = [{ name: 'You' }];
      for (let i = 1; i <= numBots.value; i++) {
        players.push({ name: `Bot ${i}` });
      }
      store.dispatch('initializeGame', players);
      router.push('/hand-play');
    };

    return { numBots, startGame };
  },
};
</script>
