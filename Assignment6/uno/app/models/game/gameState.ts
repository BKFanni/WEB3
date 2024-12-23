import { Card } from "./card"
import { Player } from "./player"

export type GameState = {
    id: string
    name: string
    players: Player[]
    maxPlayers: number
    discardPile: Card[]
    drawPile?: Card[]
    currentPlayerIndex: number
    direction: number
    isGameOver: boolean
    createdAt: Date
}