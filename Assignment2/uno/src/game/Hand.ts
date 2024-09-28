import { Card, CardColor } from "./Card"
import { Deck } from "./Deck"

// Hand aka Player for a SINGLE Uno round
export type Hand = {
    name: string;
    cards: Card[];

    playCard(cardNumber: number, deck: Deck): Card;
    pickCard(deck: Deck): Card;
    changeWildcardColor(cardNumber: number, color: CardColor): void
}

export function createHand(playerName: string, deck: Deck, cardAmount: number): Hand {
    // Simple checks
    if (playerName.length < 1) {
        throw new Error("Invalid player name!");
    }
    if (cardAmount < 1) {
        throw new Error("Card amount must be at least 1!");
    }
    
    const name = playerName
    let cards: Card[] = []

    for (let i = 0; i < cardAmount; i++) {
        let c = deck.pickCard()
        if (c === undefined) {
            throw new Error("Deck ran out of cards!");
        }

        cards.push(c)
    }

    const playCard = (cardNumber: number, gameDeck: Deck): Card => {
        if (cardNumber < 1 || cardNumber > cards.length) {
            throw new Error("Invalid card!");
        }

        let usedCard = cards[cardNumber]
        gameDeck.placeCard(usedCard)
        // Only remove card from hand if placing is successful
        return cards.splice(cardNumber, 1)[0]
    }

    const pickCard = (deck: Deck): Card => {
        return deck.pickCard()
    }

    const changeWildcardColor = (cardNumber: number, color: CardColor) => {
        if (cardNumber < 1 || cardNumber > cards.length) {
            throw new Error("Invalid card!");
        }

        cards[cardNumber].changeColor(color)
    }

    return {
        name,
        cards,
        playCard,
        pickCard,
        changeWildcardColor
    }
}