import { CardColor } from "./Card";
import { Deck, createDeck } from "./Deck";
import { Hand, PlayerType, createHand } from "./Hand";

export type Uno = {
    readonly targetScore: number;

    playerName(playerNumber: number): string;
    cardAmount(playerNumber: number): number;
    score(playerNumber: number): number;
    winner(): Hand | undefined;
    currentPlayer(): number;
    currentDeck(): Deck;
    newRound(): Deck;

    // Game interactions
    /**
     * Returns updated Deck after a bot's move, errors if it's not a bot's move
     */
    botMove(): Deck;
    /**
     * Returns updated Deck after a players's move, errors if it's not a players's move
     */
    playerMove(cardNumber: number, wildcardColor?: CardColor): Deck;
    /**
     * Pick a card from the deck as a player, returns updated Deck and updated Hand
     */
    playerPickCard(playerNumber: number): [Deck, Hand];
    callUno(playerNumber: number): void;
    /**
     * Accuse player of not calling Uno
     */
    accuseUno(playerNumber: number): boolean;
}

/**
 * Create a new Uno game
 * @param players game's players, key is name
 * @param targetScore target score for a player to reach to win
 * @returns Uno Game
 */
export function createGame(
    players: Map<string, PlayerType>,
    targetScore: number,
    startingCards: number
): Uno {
    // Parameter checks
    if (players.size < 2) {
        throw new Error("Not enough players!");
    }
    if (targetScore <= 0) {
        throw new Error("Target score must be positive number!");       
    }

    // Variable definitions
    let playerArr: Hand[] = []
    let scores: number[] = []
    let current: number = 0
    // currentHand + movementDirection = next hand
    let movementDirection: number = 1
    let currentDeck: Deck = createDeck()

    // Populating variables if needed
    // Players
    players.forEach(
        (v, k) => playerArr.push(createHand(k, currentDeck, startingCards, v))
    )

    // Function definitions
    const playerName = (playerNumber: number): string => {
        if (playerNumber <= 0 || players.size <= playerNumber) {
            throw new Error("Invalid player!");
        }
        return players[playerNumber].name
    }

    const score = (playerNumber: number): number => {
        if (playerNumber <= 0 || players.size <= playerNumber) {
            throw new Error("Invalid player!");
        }
        return scores[playerNumber]
    }

    const cardAmount = (playerNumber: number): number => {
        if (playerNumber <= 0 || players.size <= playerNumber) {
            throw new Error("Invalid player!");
        }
        return playerArr[playerNumber].cards.length
    }

    const winner = (): Hand | undefined => {
        let winners = playerArr.filter((h, i) => {
            return scores[i] >= targetScore
        })

        if (winners.length < 1) {
            return undefined
        }
        return winners[0]
    }

    const currentPlayer = (): number => {
        return current
    }

    const usedDeck = (): Deck => {
        return currentDeck
    }

    const newRound = (): Deck => {
        current = 0
        movementDirection = 1
        currentDeck = createDeck()
        playerArr = []
        players.forEach(
            (v, k) => playerArr.push(createHand(k, currentDeck, startingCards, v))
        )
        return currentDeck
    }

    const accuseUno = (playerNumber: number): boolean => {
        if (playerNumber <= 0 || players.size <= playerNumber) {
            throw new Error("Invalid player!");
        }

        if (playerArr[playerNumber].calledUno || playerArr[playerNumber].cards.length > 1) {
            return false;
        }

        for (let i = 0; i < 4; i++) {
            let c = playerArr[playerNumber].pickCard(currentDeck)
            if (c === undefined) {
                break
            }
        }
        return true
    }

    const callUno = (playerNumber: number): void => {
        if (playerNumber <= 0 || players.size <= playerNumber) {
            throw new Error("Invalid player!");
        }
        playerArr[playerNumber].callUno()
    }

    return {
        targetScore,
        playerName,
        score,
        cardAmount,
        winner,
        currentPlayer,
        newRound,
        currentDeck: usedDeck,
        accuseUno,
        callUno
    }
}