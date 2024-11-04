import { Card, CardColor } from "./Card"
import { Deck } from "./Deck"

export enum PlayerType {
    Player,
    EasyBot,
    MediumBot,
    HardBot
}

/**
 * Hand aka Player for a SINGLE Uno round
 * The frontend should only use this type to read information
 * The backend (Uno.ts, etc) use it to both read info and call methods
 */
export type Hand = {
    readonly name: string;
    cards: Card[];
    readonly playerType: PlayerType;
    calledUno: boolean;

    playCard(cardNumber: number, deck: Deck): Card;
    pickCard(deck: Deck): Card | undefined;
    changeWildcardColor(cardNumber: number, color: CardColor): void;
    callUno(): void;
}

export function createHand(
    playerName: string,
    deck: Deck,
    cardAmount: number,
    playerType: PlayerType = PlayerType.EasyBot
): Hand {
    // Simple checks
    if (playerName.length < 1) {
        throw new Error("Invalid player name!");
    }
    if (cardAmount < 1) {
        throw new Error("Card amount must be at least 1!");
    }
    
    const name = playerName
    const cards: Card[] = []
    let calledUno: boolean = false

    for (let i = 0; i < cardAmount; i++) {
        const c = deck.pickCard()
        if (c === undefined) {
            throw new Error("Deck ran out of cards!");
        }

        cards.push(c)
    }

    const playCard = (cardNumber: number, gameDeck: Deck): Card => {
        if (cardNumber < 0 || cardNumber >= cards.length) {
            throw new Error("Invalid card!");
        }

        const usedCard = cards[cardNumber]
        gameDeck.placeCard(usedCard)
        // Only remove card from hand if placing is successful
        return cards.splice(cardNumber, 1)[0]
    }

    const pickCard = (deck: Deck): Card | undefined => {
        calledUno = false
        const c = deck.pickCard()
        if (c === undefined) {
            return c
        }
        cards.push(c)

        return c
    }

    const changeWildcardColor = (cardNumber: number, color: CardColor) => {
        // Check if the cardNumber is out of bounds
        if (cardNumber < 0 || cardNumber >= cards.length ||
            (cards[cardNumber].type !== "Wild" && cards[cardNumber].type !== "Wild Draw Four")
        ) {
            throw new Error("Invalid card!");
        }
    
        // Safely change the color if the method exists
        const card = cards[cardNumber];
        if (card && typeof card.changeColor === "function") {
            card.changeColor(color);
        } else {
            throw new Error("Card method 'changeColor' is not defined.");
        }
    };
    

    const callUno = () => {
        if (cards.length > 1) {
            throw new Error("Card amount more than 1!");
        }
        calledUno = true
    }

    return {
        name,
        cards,
        playerType,
        calledUno,
        playCard,
        pickCard,
        changeWildcardColor,
        callUno
    }
}