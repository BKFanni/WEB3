import { makeAMove } from "./Bot";
import { Card, CardColor, calculatePoints } from "./Card";
import { Deck, createDeck } from "./Deck";
import { Hand, PlayerType, createHand } from "./Hand";

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

    botMove(): Deck;
    playerMove(cardNumber: number, wildcardColor?: CardColor): Deck;
    playerPickCard(playerNumber: number): [Deck, Hand];
    callUno(playerNumber: number): void;
    accuseUno(playerNumber: number): boolean;
}

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
    const scores: number[] = [];
    let currentPlayer: number = 0;
    let movementDirection: number = 1;
    let currentDeck: Deck = createDeck();

    players.forEach((type, name) => {
        playerArr.push(createHand(name, currentDeck, startingCards, type));
    });

    const playerName = (playerNumber: number): string => {
        if (playerNumber < 0 || playerNumber >= playerArr.length) {
            throw new Error("Invalid player!");
        }
        return playerArr[playerNumber].name;
    };

    const score = (playerNumber: number): number => {
        if (playerNumber < 0 || playerNumber >= playerArr.length) {
            throw new Error("Invalid player!");
        }
        return scores[playerNumber];
    };

    const cardAmount = (playerNumber: number): number => {
        if (playerNumber < 0 || playerNumber >= playerArr.length) {
            throw new Error("Invalid player!");
        }
        return playerArr[playerNumber].cards.length;
    };

    const winner = (): Hand | undefined => {
        const winners = playerArr.filter((_, i) => scores[i] >= targetScore);
        return winners.length > 0 ? winners[0] : undefined;
    };

    const prevPlayer = (): number => {
        const totalPlayers = playerArr.length;
        return (currentPlayer - movementDirection + totalPlayers) % totalPlayers;
    };

    const newRound = (): Deck => {
        currentPlayer = 0;
        movementDirection = 1;
        currentDeck = createDeck();
        playerArr = [];
        players.forEach((type, name) => playerArr.push(createHand(name, currentDeck, startingCards, type)));
        return currentDeck;
    };

    const accuseUno = (playerNumber: number): boolean => {
        if (playerNumber < 0 || playerNumber >= playerArr.length) {
            throw new Error("Invalid player!");
        }
        const hand = playerArr[playerNumber];
        if (hand.calledUno || hand.cards.length > 1) return false;
        for (let i = 0; i < 4; i++) hand.pickCard(currentDeck);
        return true;
    };

    const callUno = (playerNumber: number): void => {
        if (playerNumber < 0 || playerNumber >= playerArr.length) {
            throw new Error("Invalid player!");
        }
        playerArr[playerNumber].callUno();
    };

    const playerPickCard = (playerNumber: number): [Deck, Hand] => {
        if (playerNumber < 0 || playerNumber >= playerArr.length) {
            throw new Error("Invalid player!");
        }
        if (currentPlayer !== playerNumber) {
            throw new Error("Current player does not have the turn!");
        }
        playerArr[playerNumber].pickCard(currentDeck);
        return [currentDeck, playerArr[playerNumber]];
    };

    const playerMove = (cardNumber: number, wildcardColor?: CardColor): Deck => {
        if (wildcardColor !== undefined) {
            playerArr[currentPlayer].changeWildcardColor(cardNumber, wildcardColor);
        }

        const card = playerArr[currentPlayer].playCard(cardNumber, currentDeck);

        // Check if the card is valid before calling incrementCurrentPlayer
        if (card) {
            awardIfWonRound();
            incrementCurrentPlayer(card);
        } else {
            // If the player cannot play, allow them to pick a card
            playerPickCard(currentPlayer);
        }

        return currentDeck;
    };

    const botMove = (): Deck => {
        if (playerArr[currentPlayer].playerType === PlayerType.Player) {
            throw new Error("It is human player's turn!");
        }

        const placed: Card | undefined = makeAMove(playerArr[currentPlayer], {
            targetScore,
            playerCount: playerArr.length,
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
            playerMove,
            botMove
        });

        // Ensure placed is not undefined before calling incrementCurrentPlayer
        if (placed) {
            awardIfWonRound();
            incrementCurrentPlayer(placed);
        } else {
            throw new Error("Bot could not make a valid move.");
        }

        return currentDeck;
    };

    const awardIfWonRound = (): void => {
        const player = playerArr[currentPlayer];
        if (player.cards.length === 0) {
            if (player.calledUno) scores[currentPlayer] += calculatePoints(player.cards);
            else for (let i = 0; i < 4; i++) playerPickCard(currentPlayer);
        }
    };

    const incrementCurrentPlayer = (card: Card): void => {
        let movement = movementDirection;
        if (card.type === "Reverse") movementDirection *= -1;
        if (card.type === "Skip") movement *= 2;
        const totalPlayers = playerArr.length;
        currentPlayer = (currentPlayer + movement + totalPlayers) % totalPlayers;
    };

    return {
        targetScore,
        playerCount: playerArr.length,
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
        playerMove,
        botMove,
    };
}

export { PlayerType };
