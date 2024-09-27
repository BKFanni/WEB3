<template>
    <div class="game-board">
      <h1>Uno Game</h1>
      <div class="player-hand">
        <h2>Your Hand</h2>
        <div class="cards">
          <Card v-for="(card, index) in playerHand" :key="index" :card="card" @click="playCard(card)" />
        </div>
        <button @click="drawCard">Draw Card</button>
        <button @click="sayUno">Say Uno</button>
      </div>
      
      <div class="bots-hands">
        <div v-for="(bot, index) in bots" :key="index" class="bot-hand">
          <h3>Bot {{ index + 1 }}</h3>
          <p>Cards: {{ bot.cards.length }}</p>
        </div>
      </div>
  
      <div class="discard-pile">
        <h2>Current Card</h2>
        <Card :card="currentCard" />
      </div>
  
      <div v-if="winner">
        <p>{{ winner }} won the hand!</p>
        <button @click="nextHand">Next Hand</button>
      </div>
    </div>
  </template>
  
  <script>
  import Card from './Card.vue';
  
  export default {
    components: { Card },
    computed: {
      playerHand() {
        return this.$store.state.playerHand;
      },
      bots() {
        return this.$store.state.bots;
      },
      currentCard() {
        return this.$store.state.currentCard;
      },
      winner() {
        return this.$store.state.winner;
      }
    },
    methods: {
      playCard(card) {
        this.$store.dispatch('playCard', card);
      },
      drawCard() {
        this.$store.dispatch('drawCard');
      },
      sayUno() {
        this.$store.dispatch('sayUno');
      },
      nextHand() {
        this.$store.dispatch('nextHand');
      }
    }
  };
  </script>
  