// Define the colors and values for an Uno deck
const COLORS = ["red", "yellow", "green", "blue"];
const VALUES = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "skip",
  "reverse",
  "drawTwo",
];
const WILD_CARDS = ["wild", "wildDrawFour"];

/**
 * Generates a full Uno deck with 108 cards.
 * @returns {Array} A shuffled array of card objects.
 */
export function generateDeck() {
  const deck = [];

  // Add colored cards (two of each for values 1-9 and special cards)
  COLORS.forEach((color) => {
    // Add "0" card (only one per color)
    deck.push({ color, value: "0" });

    // Add two of each card for values 1-9 and special cards
    for (let i = 0; i < 2; i++) {
      VALUES.forEach((value) => {
        deck.push({ color, value });
      });
    }
  });

  // Add wild cards (four of each type)
  for (let i = 0; i < 4; i++) {
    WILD_CARDS.forEach((value) => {
      deck.push({ color: "wild", value });
    });
  }

  return shuffleDeck(deck);
}

/**
 * Shuffles the deck using the Fisher-Yates algorithm.
 * @param {Array} deck - The deck of cards to shuffle.
 * @returns {Array} The shuffled deck.
 */
export function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * Deals cards to players at the start of the game.
 * @param {Array} deck - The deck of cards.
 * @param {Number} numPlayers - The number of players.
 * @returns {Object} An object containing player hands and the updated deck.
 */
export function dealCards(deck, numPlayers) {
  const playerHands = Array.from({ length: numPlayers }, () => []);

  for (let i = 0; i < 7; i++) {
    playerHands.forEach((hand) => hand.push(deck.pop()));
  }

  return { playerHands, deck };
}

/**
 * Checks if a card can be played on the current discard pile.
 * @param {Object} card - The card the player wants to play.
 * @param {Object} topCard - The current top card on the discard pile.
 * @returns {Boolean} Whether the card can be played.
 */
export function isValidMove(card, topCard) {
  return (
    card.color === topCard.color ||
    card.value === topCard.value ||
    card.color === "wild"
  );
}

/**
 * Calculates the score of a player's hand at the end of a hand.
 * @param {Array} hand - The player's remaining cards.
 * @returns {Number} The total score for the hand.
 */
export function calculateScore(hand) {
  return hand.reduce((score, card) => {
    if (card.value === "wild" || card.value === "wildDrawFour") {
      return score + 50;
    }
    if (["skip", "reverse", "drawTwo"].includes(card.value)) {
      return score + 20;
    }
    return score + parseInt(card.value, 10) || 0;
  }, 0);
}
