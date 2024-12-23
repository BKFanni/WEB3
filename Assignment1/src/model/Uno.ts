import { Card, CardColor, calculatePoints } from "./Card";
import { Deck, createDeck } from "./Deck";
import { Hand, PlayerType, createHand } from "./Hand";

/**
 * The game type that the frontend is calling to advance game
 */
export type Uno = {
    readonly targetScore: number;
    readonly playerCount: number;
    readonly currentPlayer: number;
    readonly currentDeck: Deck;

    playerName(playerNumber: number): string;
    cardAmount(playerNumber: number): number;
    score(playerNumber: number): number;
    winner(): Hand | undefined;
    prevPlayer(): number;
    newRound(): Deck;

    /**
     * Returns updated Deck after a player's move, errors if it's not a player's move
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
};

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
    if (players.size < 2) {
        throw new Error("Not enough players!");
    }
    if (targetScore <= 0) {
        throw new Error("Target score must be positive number!");
    }

    let playerArr: Hand[] = [];
    let scores: number[] = [];
    let currentPlayer: number = 0;
    let movementDirection: number = 1;
    let currentDeck: Deck = createDeck();

    players.forEach((v, k) => playerArr.push(createHand(k, currentDeck, startingCards, v)));

    const playerName = (playerNumber: number): string => {
        if (playerNumber < 0 || playerNumber >= players.size) {
            throw new Error("Invalid player!");
        }
        return playerArr[playerNumber].name;
    };

    const score = (playerNumber: number): number => {
        if (playerNumber < 0 || playerNumber >= players.size) {
            throw new Error("Invalid player!");
        }
        return scores[playerNumber] || 0;
    };

    const cardAmount = (playerNumber: number): number => {
        if (playerNumber < 0 || playerNumber >= players.size) {
            throw new Error("Invalid player!");
        }
        return playerArr[playerNumber].cards.length;
    };

    const winner = (): Hand | undefined => {
        return playerArr.find((_, i) => scores[i] >= targetScore);
    };

    const prevPlayer = (): number => {
        return (currentPlayer - movementDirection + playerArr.length) % playerArr.length;
    };

    const newRound = (): Deck => {
        currentPlayer = 0;
        movementDirection = 1;
        currentDeck = createDeck();
        playerArr = [];
        players.forEach((v, k) => playerArr.push(createHand(k, currentDeck, startingCards, v)));
        return currentDeck;
    };

    const accuseUno = (playerNumber: number): boolean => {
        if (playerNumber < 0 || playerNumber >= players.size) {
            throw new Error("Invalid player!");
        }

        const player = playerArr[playerNumber];
        if (player.calledUno || player.cards.length > 1) {
            return false;
        }

        for (let i = 0; i < 4; i++) {
            const card = player.pickCard(currentDeck);
            if (!card) break;
        }
        return true;
    };

    const callUno = (playerNumber: number): void => {
        if (playerNumber < 0 || playerNumber >= players.size) {
            throw new Error("Invalid player!");
        }
        playerArr[playerNumber].callUno();
    };

    const playerPickCard = (playerNumber: number): [Deck, Hand] => {
        if (playerNumber < 0 || playerNumber >= players.size) {
            throw new Error("Invalid player!");
        }
        if (currentPlayer !== playerNumber) {
            throw new Error("Not this player's turn!");
        }

        playerArr[playerNumber].pickCard(currentDeck);
        return [currentDeck, playerArr[playerNumber]];
    };

    const playerMove = (cardNumber: number, wildcardColor?: CardColor): Deck => {
        if (wildcardColor !== undefined) {
            playerArr[currentPlayer].changeWildcardColor(cardNumber, wildcardColor);
        }

        const playedCard = playerArr[currentPlayer].playCard(cardNumber, currentDeck);
        awardIfWonRound();
        incrementCurrentPlayer(playedCard);

        return currentDeck;
    };

    const awardIfWonRound = (): void => {
        const player = playerArr[currentPlayer];
        if (player.cards.length === 0 && player.calledUno) {
            scores[currentPlayer] += playerArr.reduce((sum, p) => sum + calculatePoints(p.cards), 0);
        } else if (player.cards.length === 0) {
            for (let i = 0; i < 4; i++) {
                playerPickCard(currentPlayer);
            }
        }
    };

    const incrementCurrentPlayer = (card: Card): void => {
        let movement = movementDirection;
        if (card) {
            if (card.type === "Reverse") {
                movementDirection *= -1;
                movement = movementDirection;
            }
            if (card.type === "Skip") {
                movement *= 2;
            }
        }
        currentPlayer = (currentPlayer + movement + playerArr.length) % playerArr.length;
    };

    return {
        targetScore,
        playerCount: players.size,
        currentPlayer,
        currentDeck,
        playerName,
        score,
        cardAmount,
        winner,
        prevPlayer,
        newRound,
        accuseUno,
        callUno,
        playerPickCard,
        playerMove
    };
}
