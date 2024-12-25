import { Card } from "./card"

export type Player = {
    playerId: string
    name: string
    hand?: Card[]
    calledUno: boolean
    score: number
}