const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  id: String,       // Socket ID
  name: String,     // Player's name
  hand: Array,      // Cards in the player's hand
  score: {
    type: Number,
    default: 0
  }
});

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  players: [playerSchema],         // Array of players
  discardPile: Array,              // The discard pile of cards
  drawPile: Array,                 // The draw pile of cards
  currentPlayerIndex: {
    type: Number,
    default: 0
  },
  direction: {
    type: Number,
    default: 1    // 1 for clockwise, -1 for counterclockwise
  },
  isGameOver: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);
