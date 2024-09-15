import { Hand } from './Hand';

export type Props = {
    players: Array<string>,
    targetScore: number
}

export interface Game {
    readonly playerCount: number,
    readonly targetScore: number,

    player(playerNumber: number): string,
    score(playerNumber: number): number,
    winner(): Hand,
    currentHand(): Hand
}

export function createGame({
    players,
    targetScore
}: Partial<Props>): Game {
    // first safety checks
    if (!players) {
        players = ['a', 'b']
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

    // Setup
    let uno: Game = {
        playerCount: players.length,
        targetScore: targetScore,
        player: function (playerNumber: number): string {
            throw new Error('Function not implemented.');
        },
        score: function (playerNumber: number): number {
            throw new Error('Function not implemented.');
        },
        winner: function () {
            throw new Error('Function not implemented.');
        },
        currentHand: function () {
            throw new Error('Function not implemented.');
        }
    }
    

    return uno
}