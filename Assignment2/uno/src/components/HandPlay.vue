<template>
  <div v-if="!gameOver">
    <h2>Current Player: {{ currentPlayer.name }}</h2>
    <div v-if="isPlayerTurn">
      <div v-for="(card, index) in currentPlayer.cards" :key="index" @click="playCard(index)">
        <p :style="{ color: getColor(card.color) }">
          {{ card.type }} {{ card.value !== undefined ? card.value : '' }}
        </p>
      </div>
      <button @click="pickCard">Pick Card</button>
      <button v-if="currentPlayer.cards.length === 1" @click="callUno">Call Uno</button>
    </div>
    <div v-else>
      <p>Waiting for bots to play...</p>
    </div>
    <div v-if="discardPile.length > 0">
      <h3>Discard Pile</h3>
      <p :style="{ color: getColor(discardPile[discardPile.length - 1].color) }">
        {{ discardPile[discardPile.length - 1].type }} {{ discardPile[discardPile.length - 1].value || '' }}
      </p>
    </div>
    <button @click="endGame">End Game</button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const currentPlayer = computed(() => store.state.unoGame.players[store.state.currentPlayerIndex]);
    const discardPile = computed(() => store.state.discardPile);
    const gameOver = computed(() => store.state.gameOver);
    const isPlayerTurn = computed(() => currentPlayer.value.playerType === 'Player');

    const getColor = (color) => {
      switch (color) {
        case 0: return 'red';
        case 1: return 'green';
        case 2: return 'blue';
        case 3: return 'yellow';
        default: return 'black';
      }
    };

    const playCard = (cardIndex) => {
      if (isPlayerTurn.value) {
        store.dispatch('playerPlayCard', { cardIndex });
      }
    };

    const pickCard = () => {
      if (isPlayerTurn.value) {
        store.dispatch('playerPickCard');
      }
    };

    const callUno = () => {
      if (currentPlayer.value.cards.length === 1) {
        store.dispatch('callUno', store.state.currentPlayerIndex);
      }
    };

    const endGame = () => {
      store.dispatch('endGame');
    };

    return { currentPlayer, discardPile, playCard, pickCard, callUno, endGame, gameOver, isPlayerTurn, getColor };
  },
};
</script>
