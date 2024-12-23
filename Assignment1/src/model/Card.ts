import { shuffleArray } from "./Utils";

export enum CardColor {
    Red,
    Green,
    Blue,
    Yellow
}

export type Card = {
    color: CardColor;       
    readonly type: "Number" | "Skip" | "Reverse" | "Draw Two" | "Wild" | "Wild Draw Four";     
    readonly value?: number;
    changeColor?(col: CardColor): void;
}

/**
 * Table with cards, frontend should use this only to read info
 * Backend (Uno.ts, Hand.ts, etc) use it to both read info and call methods
 */
export type Deck = {
    placedCards: Card[];
    availableCards: Card[];
    currentColor?: CardColor;

    pickCard(): Card | undefined;
    placeCard(card: Card): void;
};

export function createDeck(): Deck {
    let availableCards = shuffleArray(createCards());
    let placedCards: Card[] = [];
    let currentColor: CardColor | undefined = undefined;

    const pickCard = () => {
        let picked = availableCards.pop();
        if (picked === undefined) {
            // reshuffling placed cards and putting them as available
            availableCards.push(...shuffleArray(placedCards));
            placedCards = [];
            return availableCards.pop();
        }
        return picked;
    };

    const placeCard = (card: Card) => {
        // Checking if there's no set color
        if (currentColor === undefined) {
            placedCards.push(card);
            currentColor = card.color;
            return;
        }

        // Checking if card's color matches current color
        if (currentColor !== card.color && card.type !== "Wild") {
            throw new Error("Card's color doesn't match!");
        }

        placedCards.push(card);
        currentColor = card.color;
    };

    return {
        placedCards,
        availableCards,
        currentColor,
        pickCard,
        placeCard
    };
}

const createCards = (): Card[] => {
    let cards: Card[] = [];
    // Blue number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: CardColor.Blue,
            type: "Number",
            value: i % 10
        });
    }
    // Green number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: CardColor.Green,
            type: "Number",
            value: i % 10
        });
    }
    // Red number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: CardColor.Red,
            type: "Number",
            value: i % 10
        });
    }
    // Yellow number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: CardColor.Yellow,
            type: "Number",
            value: i % 10
        });
    }

    // Wild / Draw 4 cards
    for (let i = 0; i < 4; i++) {
        cards.push({
            color: CardColor.Red, // Random default color
            type: "Wild",
            changeColor(col: CardColor): void {
                this.color = col;
            }
        });
        cards.push({
            color: CardColor.Red,
            type: "Wild Draw Four",
            changeColor(col: CardColor): void {
                this.color = col;
            }
        });
    }

    // Skip / Reverse / Draw 2 cards
    for (let i = 0; i < 2; i++) {
        cards.push({ color: CardColor.Blue, type: "Skip" });
        cards.push({ color: CardColor.Red, type: "Skip" });
        cards.push({ color: CardColor.Green, type: "Skip" });
        cards.push({ color: CardColor.Yellow, type: "Skip" });

        cards.push({ color: CardColor.Blue, type: "Reverse" });
        cards.push({ color: CardColor.Red, type: "Reverse" });
        cards.push({ color: CardColor.Green, type: "Reverse" });
        cards.push({ color: CardColor.Yellow, type: "Reverse" });

        cards.push({ color: CardColor.Blue, type: "Draw Two" });
        cards.push({ color: CardColor.Red, type: "Draw Two" });
        cards.push({ color: CardColor.Green, type: "Draw Two" });
        cards.push({ color: CardColor.Yellow, type: "Draw Two" });
    }

    return cards;
};

export function calculatePoints(cards: Card[]): number {
    let total = 0;
    cards.forEach(c => {
        if (c.type === "Number") { total += c.value ?? 0; }
        if (c.type === "Draw Two") { total += 20; }
        if (c.type === "Reverse") { total += 20; }
        if (c.type === "Skip") { total += 20; }
        if (c.type === "Wild") { total += 50; }
        if (c.type === "Wild Draw Four") { total += 50; }
    });

    return total;
}
