import { Card, CardType, Color } from "./card";
import { GameState } from "./gameState";
import { Player } from "./player";

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
        if (c.cardType === CardType.Number) {
            // Use default value 0 if c.value is undefined
            total += c.value ?? 0; 
        }
        if (c.cardType === CardType.DrawTwo) { total += 20 }
        if (c.cardType === CardType.Reverse) { total += 20 }
        if (c.cardType === CardType.Skip) { total += 20 }
        if (c.cardType === CardType.Wild) { total += 50 }
        if (c.cardType === CardType.WildDrawFour) { total += 50 }
    });
    return total;
}

export function createDeck(): Card[] {
    const deck: Card[] = [];

    for (const color of [Color.Red, Color.Blue, Color.Green, Color.Yellow]) {
        deck.push({ color, cardType: CardType.Number, value: 0, cardId: deck.length });
        for (let i = 1; i <= 9; i++) {
            deck.push({ color, cardType: CardType.Number, value: i, cardId: deck.length });
            deck.push({ color, cardType: CardType.Number, value: i, cardId: deck.length });
        }
        for (let i = 0; i < 2; i++) {
            deck.push({ color, cardType: CardType.DrawTwo, cardId: deck.length });
            deck.push({ color, cardType: CardType.Skip, cardId: deck.length });
            deck.push({ color, cardType: CardType.Reverse, cardId: deck.length });
        }
    }

    for (let i = 0; i < 4; i++) {
        deck.push({ color: Color.Wild, cardType: CardType.Wild, cardId: deck.length });
        deck.push({ color: Color.Wild, cardType: CardType.WildDrawFour, cardId: deck.length });
    }

    return deck;
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

/**
 * Check if the card is playable
 * @param card the card to play
 * @param topCard last card on discard pile
 * @returns Can the card be played
 */
export function isCardPlayable(card: Card, topCard: Card): boolean {
    return (
        card.color === topCard.color ||
        card.color === Color.Wild  || topCard.color === Color.Wild ||
        (
            card.cardType === CardType.Number && topCard.cardType === CardType.Number &&
            card.value !== undefined && topCard.value !== undefined &&
            card.value === topCard.value
        )
    );
}

/**
 * Removes information from game state that shouldn't be public to all players
 * @param game game state which to use
 */
export function removeGameStateSecrets(game: GameState): GameState {
    const sanitized = {...game}
    sanitized.drawPile = undefined
    const sanitizedPlayers: Player[] = []
    sanitized.players.forEach(p => {
        const copy = {...p}
        copy.hand = undefined
        sanitizedPlayers.push(copy)
    });
    sanitized.players = sanitizedPlayers

    return sanitized
}