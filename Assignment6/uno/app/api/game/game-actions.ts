"use server"

import GameDb from "@/app/models/database/game"
import { Card } from "@/app/models/game/card"
import { GameState } from "@/app/models/game/gameState"
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
    } catch (err) {
        if (isError(err))
            console.error("Error while joining game! ", err.message)
        return
    }
    redirect(`/game/${gameId}`)
}

export async function getGameList(): Promise<GameState[]> {
    return []
}

export async function getGameInfo(gameId: string): Promise<GameState> {
    return {
        id: gameId,
        name: "test name",
        players: [],
        maxPlayers: 2,
        discardPile: [],
        currentPlayerIndex: 0,
        direction: 1,
        isGameOver: false,
        createdAt: new Date()
    }
}

export async function drawCard(gameId: string, playerIdHex: string): Promise<boolean> {
    return gameId === playerIdHex
}

export async function checkPlayersTurn(gameId: string, playerIdHex: string): Promise<boolean> {
    return gameId === playerIdHex
}

export async function playCard(gameId: string, playerIdHex: string, card: Card): Promise<boolean> {
    return gameId === playerIdHex && card.id === 0
}

export async function getPlayersCards(gameId: string, playerIdHex: string): Promise<Card[]> {
    if (gameId === playerIdHex)
        return []

    return []
}