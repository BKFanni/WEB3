import { GameState } from "./model/GameState";
import { Player } from "./model/Player";
import { Card } from "./model/Card";
import { createDeck, shuffle } from "./utils";
import { Color } from "./model/Card";


export function initializeGame(playerNames: string[]): GameState {
  const deck = shuffle(createDeck());

  const players: Player[] = playerNames.map(name => ({
    name,
    hand: deck.splice(0, 7),
    calledUno: false
  }));

  const discardPile = [deck.pop() as Card];
  const drawPile = deck;

  return {
    players,
    discardPile,
    drawPile,
    turnOrder: Array.from({ length: players.length }, (_, i) => i),
    scores: Object.fromEntries(playerNames.map(name => [name, 0])),
    currentPlayerIndex: 0
  };
}


export function drawCard(state: GameState, playerIndex: number): GameState {
  if (state.drawPile.length === 0) return state;

  const newDrawPile = [...state.drawPile];
  const drawnCard = newDrawPile.pop() as Card;

  const newPlayers = state.players.map((player, index) =>
    index === playerIndex
      ? { ...player, hand: [...player.hand, drawnCard] }
      : player
  );

  return { ...state, drawPile: newDrawPile, players: newPlayers };
}


export function playCard(
  state: GameState,
  playerIndex: number,
  card: Card
): GameState | null {
  const player = state.players[playerIndex];
  const topCard = state.discardPile[state.discardPile.length - 1];

  if (!isPlayable(card, topCard)) return null;

  const newHand = player.hand.filter(c => c !== card);
  const newDiscardPile = [...state.discardPile, card];
  const newPlayers = state.players.map((p, i) =>
    i === playerIndex ? { ...p, hand: newHand } : p
  );

  return { ...state, discardPile: newDiscardPile, players: newPlayers };
}


function isPlayable(card: Card, topCard: Card): boolean {
  return (
    card.color === topCard.color ||
    card.type === topCard.type ||
    card.color === Color.Wild
  );
}
