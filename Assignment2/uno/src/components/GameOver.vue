<template>
    <div class="game-over">
      <h1>Game Over!</h1>
      <p>Winner: {{ winner }}</p>
      <button @click="restartGame">Play Again</button>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      winner() {
        return this.$store.state.winner;
      }
    },
    methods: {
      restartGame() {
        this.$store.dispatch('restartGame');
        this.$router.push('/setup');
      }
    }
  };
  </script>
  