import { Card } from "./card"

export type Player = {
    id: string
    name: string
    hand?: Card[]
    calledUno: boolean
    score: number
}