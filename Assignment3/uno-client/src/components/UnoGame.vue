<template>
  <div class="game-container">
    <h2>Game Room: {{ gameId }}</h2>
    <div v-if="game">
      <h3>It's <span class="player-name">{{ currentTurnPlayer.name || 'Waiting for players' }}</span>'s turn</h3>
      <div class="discard-pile">
        <p>Top of Discard Pile:</p>
        <div :class="['card', topCard.color]">{{ topCard.value }}</div>
      </div>

      <div class="player-hand">
        <h3>Your Hand:</h3>
        <ul>
          <li v-for="card in player.hand" :key="card.color + card.value" class="card-container">
            <div :class="['card', card.color]">
              {{ card.color }} {{ card.value }}
            </div>
            <button class="play-button" @click="playCard(card)">Play</button>
          </li>
        </ul>
      </div>
      <button class="draw-card-button" @click="drawCard">Draw Card</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnoGame',
  props: ['gameId'],
  data() {
    return {
      game: null,
      player: null,
      currentTurnPlayer: null,
      topCard: null
    };
  },
  created() {
    this.$socket.emit('joinGame', this.gameId);
    this.$socket.on('gameUpdate', (game) => {
      this.game = game;
      this.player = game.players.find(p => p.id === this.$socket.id);
      this.currentTurnPlayer = game.players[game.currentPlayerIndex];
      this.topCard = game.discardPile[game.discardPile.length - 1];
    });
    this.$socket.on('gameOver', ({ winner }) => {
      alert(`Game Over! Player ${winner} wins!`);
    });
  },
  methods: {
    playCard(card) {
      this.$socket.emit('playCard', this.gameId, card);
    },
    drawCard() {
      this.$socket.emit('drawCard', this.gameId);
    }
  }
};
</script>

<style scoped>
.game-container {
  font-family: 'Arial', sans-serif;
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  margin: 20px auto;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.player-name {
  font-weight: bold;
  color: #3498db;
}

.discard-pile {
  margin: 20px 0;
}

.card {
  display: inline-block;
  width: 80px;
  height: 120px;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  color: black;  /* No white text */
}

.red {
  background-color: #e74c3c;
}

.green {
  background-color: #27ae60;
}

.blue {
  background-color: #3498db;
}

.yellow {
  background-color: #f1c40f;
}

.player-hand {
  margin: 20px 0;
}

.card-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.play-button {
  margin-left: 10px;
  background-color: #2ecc71;
  color: black;  /* No white text */
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.play-button:hover {
  background-color: #27ae60;
}

.draw-card-button {
  margin-top: 20px;
  background-color: #e67e22;
  color: black;  /* No white text */
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.draw-card-button:hover {
  background-color: #d35400;
}

</style>
