<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-4xl font-bold text-blue-600 mb-8">Uno Game Setup</h1>
    
    <!-- Number of Bots -->
    <div class="mb-4">
      <label for="bots" class="block text-lg font-medium text-gray-700 mb-2">Number of Bots:</label>
      <select 
        v-model="numBots"
        id="bots"
        class="w-48 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        @change="updateBotTypes"
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
    
    <!-- Bot Intelligence Selection -->
    <div v-for="(botType, index) in botTypes" :key="index" class="mb-4">
      <label :for="'bot-' + index" class="block text-lg font-medium text-gray-700 mb-2">
        Bot {{ index + 1 }} Intelligence:
      </label>
      <select 
        v-model="botTypes[index]"
        :id="'bot-' + index"
        class="w-48 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="stupid">Stupid</option>
        <option value="smart">Smart</option>
      </select>
    </div>
    
    <!-- Start Game Button -->
    <button 
      @click="startGame"
      class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
    >
      Start Game
    </button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../store/store';

export default {
  setup() {
    const numBots = ref(1);
    const router = useRouter();
    const gameStore = useGameStore();

    // Default bot types
    const botTypes = ref(['stupid']); // Array of bot types

    // Update bot types array when the number of bots changes
    const updateBotTypes = () => {
      const newBotTypes = Array.from({ length: numBots.value }, (_, i) => botTypes.value[i] || 'stupid');
      botTypes.value = newBotTypes;
    };

    // Start the game and send bot types to the store
    const startGame = () => {
      gameStore.initializeGame(parseInt(numBots.value, 10) + 1); // +1 for the player
      gameStore.setBotTypes(botTypes.value); // Pass bot intelligence types to the store
      router.push({ name: 'PlayGame' });
    };

    return { numBots, botTypes, updateBotTypes, startGame };
  },
};
</script>

<style scoped>
.setup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
