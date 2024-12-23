"use server"

import GameDb from "@/app/models/game"
import { Card, Game, LimitedGameInfo } from "@/app/models/gameTypes"
import { isError } from "@/app/models/utils"
import { redirect } from "next/navigation"

export async function joinGame(gameId: string, playerIdHex: string, username: string) {
    try {
        const game = await GameDb.findOne({ gameId })
        if (!game) {
            console.log("Game not found:", gameId)
            return
        }

        // Checking if game is full
        if (game.players.length >= game.maxPlayers) {
            console.log("Game is full!")
            return
        }

        game.players.push({ id: playerIdHex, name: username, hand: []})
        await game.save()

        // TO DO: Game management in server memory
        redirect(`/game/${gameId}`)
    } catch (err) {
        if (isError(err))
            console.error("Error while joining game! ", err.message)
    }
}

export async function getGameList(): LimitedGameInfo[] {

}

export async function getGameInfo(gameId: string): LimitedGameInfo {

}

export async function drawCard(gameId: string, playerIdHex: string): Card | boolean {

}

export async function playCard(gameId: string, playerIdHex: string, card: Card): boolean {

}

export async function getPlayersCards(gameId: string, playerIdHex: string): Card[] {

}