import { Card, Color, CardType } from './Card';

export interface Deck {
  cards: Card[];
}

export const createDeck = (): Deck => {
  const deck: Deck = { cards: [] };
  resetDeck(deck);
  shuffleDeck(deck);
  return deck;
};

export const shuffleDeck = (deck: Deck): void => {
  for (let i = deck.cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]];
  }
};

export const drawCard = (deck: Deck): Card | undefined => {
  return deck.cards.pop();
};


export const dealCards = (deck: Deck, numCards: number): Card[] => {
  const dealtCards: Card[] = [];
  for (let i = 0; i < numCards; i++) {
    const card = drawCard(deck);
    if (card) dealtCards.push(card);
  }
  return dealtCards;
};


export const resetDeck = (deck: Deck): void => {
  deck.cards = [];

  const colors = [Color.Red, Color.Green, Color.Blue, Color.Yellow];

  colors.forEach((color) => {
    deck.cards.push({ color, type: CardType.Number, value: 0 });

    for (let i = 1; i <= 9; i++) {
      deck.cards.push({ color, type: CardType.Number, value: i });
      deck.cards.push({ color, type: CardType.Number, value: i });
    }

    for (let i = 0; i < 2; i++) {
      deck.cards.push({ color, type: CardType.Skip });
      deck.cards.push({ color, type: CardType.Reverse });
      deck.cards.push({ color, type: CardType.DrawTwo });
    }
  });

  for (let i = 0; i < 4; i++) {
    deck.cards.push({ color: Color.Wild, type: CardType.Wild });
    deck.cards.push({ color: Color.Wild, type: CardType.WildDrawFour });
  }
};
