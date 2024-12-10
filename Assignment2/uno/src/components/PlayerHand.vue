<template>
    <div class="player-hand">
      <div
        v-for="(card, index) in hand"
        :key="index"
        class="card"
        @click="playCard(card)"
      >
        {{ card.color }} {{ card.value }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['hand'],
    emits: ['playCard'],
    methods: {
      playCard(card) {
        this.$emit('playCard', card);
      },
    },
  };
  </script>
  