/**
 * Meant for players to see limited information about the game
 */
export type LimitedGameInfo = {
    id: string
    name: string
    players: Player[]
    maxPlayers: number
    discardPile: Card[]
    currentPlayerIndex: number
    direction: number
    isGameOver: boolean
    createdAt: Date
}

export type Game = {
    id: string
    name: string
    players: Player[]
    maxPlayers: number
    discardPile: Card[]
    drawPile: Card[]
    currentPlayerIndex: number
    direction: number
    isGameOver: boolean
    createdAt: Date
}

export type Player = {
    id: string
    username: string
    hand?: Card[]
    score: number
}

export type Card = {
    id: string
    value: number
    color: string
}