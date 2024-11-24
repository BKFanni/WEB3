
import { createStore, combineReducers } from 'redux';

// Define Action Types
const DRAW_CARD = 'DRAW_CARD';
const PLAY_CARD = 'PLAY_CARD';
const CHANGE_TURN = 'CHANGE_TURN';

// Action Creators
export const drawCard = (playerIndex) => ({ type: DRAW_CARD, payload: { playerIndex } });
export const playCard = (playerIndex, card) => ({ type: PLAY_CARD, payload: { playerIndex, card } });
export const changeTurn = () => ({ type: CHANGE_TURN });

// Initial State
const initialGameState = {
  players: [],
  discardPile: [],
  drawPile: [],
  turnOrder: [],
  turnDirection: 1,
  scores: {},
  currentPlayerIndex: 0,
};

// GameState Reducer
const gameStateReducer = (state = initialGameState, action) => {
  switch (action.type) {
    case DRAW_CARD:
      // Logic for drawing a card
      return state;
    case PLAY_CARD:
      // Logic for playing a card
      return state;
    case CHANGE_TURN:
      // Logic for changing turn
      return state;
    default:
      return state;
  }
};

// Combine Reducers
const rootReducer = combineReducers({
  gameState: gameStateReducer,
});

// Create Redux Store
const store = createStore(rootReducer);

export default store;
