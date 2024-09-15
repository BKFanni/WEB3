import { Hand, createHand } from './Hand';

export type Props = {
    players: Array<string>,
    targetScore: number
}

export interface Game {
    readonly playerCount: number,
    readonly targetScore: number,

    player(playerNumber: number): string,
    score(playerNumber: number): number,
    winner(): Hand | undefined,
    currentHand(): Hand
}

export function createGame({
    players,
    targetScore
}: Partial<Props>): Game {
    // first safety checks
    if (!players) {
        players = ['A', 'B']
    }
    if (!targetScore) {
        targetScore = 500
    }

    // Handling out of bounds
    if (players.length < 2 || players.length > 4) {
        throw new Error("Player amount needs to be between 2 and 4!")
    }
    if (targetScore < 1) {
        throw new Error("Target score needs to be at least 1!");
    }

    const uno: Game = {
        playerCount: players.length,
        targetScore: targetScore,
        player: getPlayer,
        score: getPlayerScore,
        winner: function(): Hand | undefined {
            let winners = playerHands.filter((h) => {
                return playerScores[h.playerId] >= this.targetScore
            })
    
            if (winners.length < 1) {
                return undefined
            }
            return winners[0]
        },
        currentHand: getCurrentTurn
    }

    // Internals
    const playerHands: Array<Hand> = []
    for (let i = 0; i < players.length; i++) {
        playerHands.push(createHand(players[i], i))
    }
    const playerScores: Array<number> = new Array(players.length).fill(0);
    let currentTurn = 0; // Current hand's turn

    // Interface functions
    function getPlayer(playerNumber: number): string {
        if (playerNumber < 0 || playerNumber >= playerHands.length) {
            throw new Error("Invalid player");
        }

        return playerHands[playerNumber].playerName
    }

    function getPlayerScore(playerNumber: number): number {
        if (playerNumber < 0 || playerNumber >= gamePlayers.length) {
            throw new Error("Invalid player");
        }

        return playerScores[playerNumber]
    }

    function getCurrentTurn(): Hand {
        return playerHands[currentTurn]
    }

    return uno
}