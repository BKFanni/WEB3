import { Card, CardColor } from "./Card"
import { shuffleArray } from "./Utils"

export type Deck = {
    placedCards: Card[];
    availableCards: Card[];
    currentColor?: CardColor;

    pickCard(): Card | undefined;
    placeCard(card: Card): void;
}

export function createDeck(): Deck {
    let availableCards = shuffleArray(createCards())
    let placedCards: Card[] = []
    let currentColor: CardColor

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
            color: CardColor.Blue,
            type: "Number",
            value: i % 10
        })
    }
    // Green number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: CardColor.Green,
            type: "Number",
            value: i % 10
        })
    }
    // Red number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: CardColor.Red,
            type: "Number",
            value: i % 10
        })
    }
    // Yellow number cards
    for (let i = 0; i < 19; i++) {
        cards.push({
            color: CardColor.Yellow,
            type: "Number",
            value: i % 10
        })
    }

    // Wild / Draw 4 cards
    for (let i = 0; i < 4; i++) {
        cards.push({
            color: CardColor.Red, // Random default color
            type: "Wild",
            changeColor(col: CardColor): void {
                this.color = col
            }
        })
        cards.push({
            color: CardColor.Red,
            type: "Wild Draw Four",
            changeColor(col: CardColor): void {
                this.color = col
            }
        })
    }

    // Skip / Reverse / Draw 2 cards
    for (let i = 0; i < 2; i++) {
        cards.push({color: CardColor.Blue, type: "Skip"})
        cards.push({color: CardColor.Red, type: "Skip"})
        cards.push({color: CardColor.Green, type: "Skip"})
        cards.push({color: CardColor.Yellow, type: "Skip"})

        cards.push({color: CardColor.Blue, type: "Reverse"})
        cards.push({color: CardColor.Red, type: "Reverse"})
        cards.push({color: CardColor.Green, type: "Reverse"})
        cards.push({color: CardColor.Yellow, type: "Reverse"})

        cards.push({color: CardColor.Blue, type: "Draw Two"})
        cards.push({color: CardColor.Red, type: "Draw Two"})
        cards.push({color: CardColor.Green, type: "Draw Two"})
        cards.push({color: CardColor.Yellow, type: "Draw Two"})
    }

    return cards
}