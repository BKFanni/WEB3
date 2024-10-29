<template>
    <div>
      <h2>Current Game State</h2>
      <p>Top Card: {{ topCard.color }} - {{ topCard.value }}</p>
      <p>Current Player: {{ currentPlayer }}</p>
    </div>
  </template>
  
  <script>
  import { useStore } from 'vuex';
  
  export default {
    setup() {
      const store = useStore();
      const topCard = store.state.discardPile[store.state.discardPile.length - 1];
      const currentPlayer = store.state.currentPlayer;
  
      return { topCard, currentPlayer };
    }
  };
  </script>
  