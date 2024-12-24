import mongoose from 'mongoose';
import { playerSchema } from './player';
import { cardSchema } from './card';



const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  players: [playerSchema],         // Array of players
  maxPlayers: {
    type: Number,
    required: true,
    default: 4
  },
  discardPile: [cardSchema],              // The discard pile of cards
  drawPile: [cardSchema],                 // The draw pile of cards
  currentPlayerIndex: {
    type: Number,
    required: true,
    default: 0
  },
  direction: {
    type: Number,
    required: true,
    default: 1    // 1 for clockwise, -1 for counterclockwise
  },
  isGameOver: {
    required: true,
    type: Boolean,
    default: false
  },
  createdAt: {
    required: true,
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Game', gameSchema);
