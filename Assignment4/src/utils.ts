// src/utils.ts
import { Card, CardType, Color } from "./model/Card";

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const color of [Color.Red, Color.Blue, Color.Green, Color.Yellow]) {
    deck.push({ color, type: CardType.Number, number: 0 });
    for (let i = 1; i <= 9; i++) {
      deck.push({ color, type: CardType.Number, number: i });
      deck.push({ color, type: CardType.Number, number: i });
    }
    for (let i = 0; i < 2; i++) {
      deck.push({ color, type: CardType.DrawTwo });
      deck.push({ color, type: CardType.Skip });
      deck.push({ color, type: CardType.Reverse });
    }
  }

  for (let i = 0; i < 4; i++) {
    deck.push({ color: Color.Wild, type: CardType.Wild });
    deck.push({ color: Color.Wild, type: CardType.WildDrawFour });
  }

  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

/**
 * Calculates the amount of points gained from the given cards
 * @param cards Cards to use
 */
export function calculatePoints(cards: Card[]): number {
  let total = 0;
  cards.forEach(c => {
      if (c.type === CardType.Number) {
          total += c.number ?? 0;  // Use default value 0 if c.value is undefined
      }
      if (c.type === CardType.DrawTwo) { total += 20 }
      if (c.type === CardType.Reverse) { total += 20 }
      if (c.type === CardType.Skip) { total += 20 }
      if (c.type === CardType.Wild) { total += 50 }
      if (c.type === CardType.WildDrawFour) { total += 50 }
  });
  return total;
}

/**
 * Calculates which player will be next
 * @param currentPlayer Current player index
 * @param playerAmount Total amount of players
 * @param turnDirection Current turn direction (1 = forward, -1 = backward)
 * @param cardType Card type placed (if omitted, acts as regular number card)
 */
export function calculateNextPlayer(
  currentPlayer: number,
  playerAmount: number,
  turnDirection: number,
  cardType?: CardType
): number {
  if (cardType === undefined) cardType = CardType.Number
  if (cardType === CardType.Reverse) turnDirection *= -1;
  let movement = turnDirection;
  if (cardType === CardType.Skip) movement *= 2;
  return (currentPlayer + movement + playerAmount) % playerAmount;
}