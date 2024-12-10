<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-100 p-6">
    <h1 class="text-4xl font-bold text-blue-600 mb-6">Uno Game</h1>
    
    <!-- Player Hand -->
    <div v-if="gameStore.players && gameStore.players.length > 0" class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-700 mb-2">Your Hand</h2>
      <PlayerHand :hand="gameStore.players[0]" @playCard="playCard" />
    </div>
    <p v-else class="text-gray-500">Loading player hand...</p>

    <!-- Bot Hands -->
    <div v-if="bots && bots.length > 0" class="w-full mb-6">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Bots</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(bot, index) in bots" :key="index" class="p-4 bg-white rounded-lg shadow-md">
          <BotDisplay :botIndex="index" :handCount="bot.hand ? bot.hand.length : 0" />
        </div>
      </div>
    </div>
    <p v-else class="text-gray-500">Loading bot hands...</p>

    <!-- Game Controls -->
    <div class="fixed bottom-4 w-full flex justify-center">
      <GameControls @drawCard="drawCard" @callUno="callUno" />
    </div>

    <!-- Discard Pile -->
    <div v-if="discardTop" class="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-700">Discard Pile</h2>
      <p class="text-lg">{{ discardTop.color }} {{ discardTop.value }}</p>
    </div>
    <p v-else class="text-gray-500">Loading discard pile...</p>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useGameStore } from '@/store/store';
import PlayerHand from '../components/PlayerHand.vue';
import BotDisplay from '../components/BotDisplay.vue';
import GameControls from '../components/GameControls.vue';

export default {
  components: { PlayerHand, BotDisplay, GameControls },
  setup() {
    const gameStore = useGameStore();

    onMounted(() => {
      if (!gameStore.players || gameStore.players.length === 0) {
        gameStore.initializeGame(4);
      }
    });

    const playCard = (card) => {
      gameStore.playCard(0, card);
    };

    const drawCard = () => {
      gameStore.drawCard(0);
    };

  
    const callUno = () => {
      gameStore.callUno(0); // Call Uno for player 0
    };

    const bots = computed(() => gameStore.players ? gameStore.players.slice(1) : []);
    const discardTop = computed(() => (gameStore.discardPile && gameStore.discardPile.length > 0) 
      ? gameStore.discardPile.at(-1) 
      : null);

    return { gameStore, playCard, drawCard, callUno, bots, discardTop };
  },
};
</script>
