<template>
    <div class="game-setup">
      <h1>Uno Game Setup</h1>
      <label for="bots">Number of bots:</label>
      <select v-model="bots">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <button @click="startGame">Start Game</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        bots: 1
      };
    },
    methods: {
      startGame() {
        this.$store.dispatch('startGame', { bots: this.bots });
        this.$router.push('/play');
      }
    }
  };
  </script>
  