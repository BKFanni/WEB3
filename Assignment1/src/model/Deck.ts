import { Card, Color, CardType } from './Card';

export interface Deck {
  cards: Card[];
  shuffle(): void;
  drawCard(): Card | undefined;
  dealCards(numCards: number): Card[];
  resetDeck(): void;
}

export class UnoDeck implements Deck {
  cards: Card[] = [];

  constructor() {
    this.resetDeck();
    this.shuffle();
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard(): Card | undefined {
    return this.cards.pop();
  }

  dealCards(numCards: number): Card[] {
    const dealtCards: Card[] = [];
    for (let i = 0; i < numCards; i++) {
      const card = this.drawCard();
      if (card) dealtCards.push(card);
    }
    return dealtCards;
  }

  resetDeck(): void {
    this.cards = [];

    const colors = [Color.Red, Color.Green, Color.Blue, Color.Yellow];

    colors.forEach((color) => {
      this.cards.push({ color, type: CardType.Number, value: 0 });
      for (let i = 1; i <= 9; i++) {
        this.cards.push({ color, type: CardType.Number, value: i });
        this.cards.push({ color, type: CardType.Number, value: i });
      }
      for (let i = 0; i < 2; i++) {
        this.cards.push({ color, type: CardType.Skip });
        this.cards.push({ color, type: CardType.Reverse });
        this.cards.push({ color, type: CardType.DrawTwo });
      }
    });

    for (let i = 0; i < 4; i++) {
      this.cards.push({ color: Color.Wild, type: CardType.Wild });
      this.cards.push({ color: Color.Wild, type: CardType.WildDrawFour });
    }
  }
}

const deck = new UnoDeck();
console.log('Deck size:', deck.cards.length);
const playerHand = deck.dealCards(7);
console.log('Player hand:', playerHand);
