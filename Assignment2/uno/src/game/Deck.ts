import { Card } from "./Card"
import { shuffleArray } from "./Utils"

export type Deck = {
    placedCards: Card[];
    availableCards: Card[];
    currentColor?: "Red" | "Green" | "Blue" | "Yellow";

    pickCard(): Card;
    placeCard(card: Card): void;
}

export function createDeck(): Deck {
    let availableCards = shuffleArray(createCards())
    let placedCards: Card[] = []
    let currentColor: "Red" | "Green" | "Blue" | "Yellow"

    const pickCard = () => availableCards.pop()

    const placeCard = (card: Card) => {
        // Checking if there's no set color
        if (currentColor === undefined) {
            placedCards.push(card)
            currentColor = card.color
            return
        }

        // Checking if card's color matches current color
        if (currentColor !== card.color && card.type !== "Wild") {
            throw new Error("Card's color doesn't match!");
        }

        placedCards.push(card)
        currentColor = card.color
    }

    return {
        placedCards,
        availableCards,
        currentColor,
        pickCard,
        placeCard
    }
}

const createCards = (): Card[] => {
    let cards: Card[] = []
    // Blue number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: "Blue",
            type: "Number",
            value: i % 10
        })
    }
    // Green number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: "Green",
            type: "Number",
            value: i % 10
        })
    }
    // Red number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: "Red",
            type: "Number",
            value: i % 10
        })
    }
    // Yellow number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: "Yellow",
            type: "Number",
            value: i % 10
        })
    }

    // Wild / Draw 4 cards
    for (let i = 0; i < 4; i++) {
        cards.push({
            color: "Red", // Random default color
            type: "Wild",
            changeColor(col: "Red" | "Green" | "Blue" | "Yellow"): void {
                this.color = col
            }
        })
        cards.push({
            color: "Red",
            type: "Wild Draw Four",
            changeColor(col: "Red" | "Green" | "Blue" | "Yellow"): void {
                this.color = col
            }
        })
    }

    // Skip / Reverse / Draw 2 cards
    for (let i = 0; i < 2; i++) {
        cards.push({color: "Blue", type: "Skip"})
        cards.push({color: "Red", type: "Skip"})
        cards.push({color: "Green", type: "Skip"})
        cards.push({color: "Yellow", type: "Skip"})

        cards.push({color: "Blue", type: "Reverse"})
        cards.push({color: "Red", type: "Reverse"})
        cards.push({color: "Green", type: "Reverse"})
        cards.push({color: "Yellow", type: "Reverse"})

        cards.push({color: "Blue", type: "Draw Two"})
        cards.push({color: "Red", type: "Draw Two"})
        cards.push({color: "Green", type: "Draw Two"})
        cards.push({color: "Yellow", type: "Draw Two"})
    }

    return cards
}