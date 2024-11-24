
import { BehaviorSubject } from 'rxjs';
import { drawCard, playCard, changeTurn } from './reduxStore';
import store from './reduxStore';

// Create a BehaviorSubject to simulate server messages
const serverMessages$ = new BehaviorSubject(null);

// Subscribe to server messages and dispatch Redux actions
serverMessages$.subscribe((message) => {
  if (!message) return;

  switch (message.type) {
    case 'DRAW_CARD':
      store.dispatch(drawCard(message.payload.playerIndex));
      break;
    case 'PLAY_CARD':
      store.dispatch(playCard(message.payload.playerIndex, message.payload.card));
      break;
    case 'CHANGE_TURN':
      store.dispatch(changeTurn());
      break;
    default:
      console.warn('Unknown message type:', message.type);
  }
});

// Simulate sending a server message
export const sendServerMessage = (message) => {
  serverMessages$.next(message);
};
