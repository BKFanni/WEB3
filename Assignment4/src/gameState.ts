import { GameState } from "./model/GameState";
import { Player } from "./model/Player";
import { Card, CardType } from "./model/Card";
import { calculateNextPlayer, createDeck, shuffle } from "./utils";
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
    turnDirection: 1,
    scores: Object.fromEntries(playerNames.map(name => [name, 0])),
    currentPlayerIndex: 0
  };
}


export function accuseUno(state: GameState, playerIndex: number): GameState {
  const player = state.players[playerIndex];
  if (player.calledUno || player.hand.length > 1) return state;

  // player didnt call uno, drawing 4 cards for the player
  let gameStateCopy = {...state}
  for (let i = 0; i < 4; i++) {
    gameStateCopy = drawCard(gameStateCopy, playerIndex)
  }

  return gameStateCopy
}

export function callUno(state: GameState, playerIndex: number): GameState {
  const stateCopy = {...state}

  if (stateCopy.players[playerIndex].hand.length > 1) return stateCopy
  // Should here be a deep copy instead? Since players is shared by both state and stateCopy
  stateCopy.players[playerIndex].calledUno = true

  return stateCopy
}


export function drawCard(state: GameState, playerIndex: number): GameState {
  if (state.drawPile.length === 0) return state;

  const newDrawPile = [...state.drawPile];
  const drawnCard = newDrawPile.pop() as Card;

  const newPlayers = state.players.map((player, index) =>
    index === playerIndex
      ? { ...player, hand: [...player.hand, drawnCard], calledUno: false }
      : player
  );

  return { ...state, drawPile: newDrawPile, players: newPlayers };
}


export function playCard(
  state: GameState,
  playerIndex: number,
  card: Card,
  wildcardColorOverride?: Color.Blue | Color.Green | Color.Red | Color.Yellow
): GameState | null {
  const player = state.players[playerIndex];
  const topCard = state.discardPile[state.discardPile.length - 1];

  if (!isPlayable(card, topCard)) return null;
  const cardCopy = {...card}
  // Changing wildcard (not +4) color before placing down
  if (cardCopy.type === CardType.Wild) {
    if (wildcardColorOverride === undefined) {
      return null;
    }
    cardCopy.color = wildcardColorOverride;
  }

  const newHand = player.hand.filter(c => c !== card);
  const newDiscardPile = [...state.discardPile, cardCopy];
  const newPlayers = state.players.map((p, i) =>
    i === playerIndex ? { ...p, hand: newHand } : p
  );

  return {
    ...state,
    discardPile: newDiscardPile,
    players: newPlayers,
    // advancing to next player
    currentPlayerIndex: calculateNextPlayer(
      state.currentPlayerIndex,
      state.players.length,
      state.turnDirection,
      card.type
    ),
    // handling reverse cards
    turnDirection: card.type === CardType.Reverse ? state.turnDirection*-1 : state.turnDirection
  };
}

/**
 * Skip current player index's turn
 * @param state game
 * @returns GameState with incremented currentPlayerIndex
 */
export function skipTurn(state: GameState): GameState {
  return {
    ...state,
    // advancing to next player
    currentPlayerIndex: calculateNextPlayer(
      state.currentPlayerIndex,
      state.players.length,
      state.turnDirection
    )
  }
}

/**
 * Start a new round using the current game
 * @param state Current game
 * @returns Current game with a new round
 */
export function newRound(state: GameState): GameState {
  const newGame = initializeGame(state.players.map(p => p.name))
  // Should we make deep copy?
  newGame.players = state.players
  newGame.scores = state.scores
  newGame.turnOrder = state.turnOrder

  return newGame
}




function isPlayable(card: Card, topCard: Card): boolean {
  return (
    card.color === topCard.color ||
    card.type === topCard.type ||
    card.color === Color.Wild
  );
}
