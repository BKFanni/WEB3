<template>
    <div>
      <h2>Available Games</h2>
      <ul>
        <li v-for="game in games" :key="game.id">
          {{ game.name }} (Players: {{ game.players.length }}/{{ game.maxPlayers }})
          <button @click="joinGame(game.id)">Join</button>
        </li>
      </ul>
      <button @click="createGame">Create New Game</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        games: []
      };
    },
    created() {
      this.fetchGames();
    },
    methods: {
      async fetchGames() {
        this.games = await this.$store.dispatch('fetchGames');
      },
      async createGame() {
        const gameId = await this.$store.dispatch('createGame');
        this.$router.push(`/game/${gameId}`);
      },
      joinGame(gameId) {
        this.$router.push(`/game/${gameId}`);
      }
    }
  };
  </script>
  