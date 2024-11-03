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
