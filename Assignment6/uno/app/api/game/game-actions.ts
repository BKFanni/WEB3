"use server"

import { convertToGameState, gameModel } from "@/app/models/database/game"
import { Card } from "@/app/models/game/card"
import { GameState, initializeGame } from "@/app/models/game/gameState"
import { isError } from "@/app/models/utils"
import { redirect } from "next/navigation"
import { connectToDatabase } from "../db-connection"
import { removeGameStateSecrets } from "@/app/models/game/gameUtils"

export async function joinGame(gameId: string, playerIdHex: string, username: string) {
    try {
        // Database stuff
        const dbCon = await connectToDatabase()
        if (!dbCon) {
            console.error("Couldn't connect to database!")
            return
        }

        const game = await gameModel.findOne({ gameId })
        if (!game) {
            console.log("Game not found:", gameId)
            dbCon.close()
            return
        }

        // Checking if game is full
        if (game.players.length >= game.maxPlayers) {
            console.log("Game is full!")
            dbCon.close()
            return
        }

        game.players.push({
            playerId: playerIdHex,
            name: username,
            score: 0,
            calledUno: false,
            hand: []
        })
        await game.save()
        dbCon.close()
    } catch (err) {
        if (isError(err))
            console.error("Error while joining game! ", err.message)
        return
    }
    redirect(`/game/${gameId}`)
}

export async function getGameList(): Promise<GameState[]> {
    try {
        // Database stuff
        const dbCon = await connectToDatabase()
        if (!dbCon) {
            console.error("Couldn't connect to database!")
            return []
        }

        const games = await gameModel.find()
        const convertedGames: GameState[] = []
        games.forEach(g => {
            const converted = convertToGameState(g)
            convertedGames.push(removeGameStateSecrets(converted))
        });
        dbCon.close()

        return convertedGames
    } catch (err) {
        if (isError(err))
            console.error("Couldn't fetch games from database!", err.message)
        return []
    }
}

/**
 * Fetch information about a game (not including player hex id/hand data and available cards)
 * @param gameId Game id
 * @returns LIMITED game info
 */
export async function getGameInfo(gameId: string): Promise<GameState | undefined> {
    try {
        // Database stuff
        const dbCon = await connectToDatabase()
        if (!dbCon) {
            console.error("Couldn't connect to database!")
            return
        }

        const game = await gameModel.findOne({ gameId })
        if (!game) {
            console.log("Game not found:", gameId)
            dbCon.close()
            return
        }

        const convertedGame = convertToGameState(game)
        const safeGame = removeGameStateSecrets(convertedGame)
        dbCon.close()
        
        return safeGame
    } catch (err) {
        if (isError(err))
            console.error("Couldn't fetch game data from database!", err.message)
        return
    }
}

export async function createGame(gameName: string, playerIdHex: string, username: string): Promise<boolean> {
    const newGameState = initializeGame([{playerId: playerIdHex, name: username}], gameName, 4)
    try {
        // Database stuff
        const dbCon = await connectToDatabase()
        if (!dbCon) {
            console.error("Couldn't connect to database!")
            return false
        }

        const dbGame = new gameModel({
            gameId: newGameState.gameId,
            name: newGameState.name,
            maxPlayers: newGameState.maxPlayers,
            direction: newGameState.direction,
            isGameOver: newGameState.isGameOver,
            createdAt: newGameState.createdAt,
            discardPile: newGameState.discardPile,
            drawPile: newGameState.drawPile,
            players: newGameState.players
        })
        await dbGame.save()
        dbCon.close()
    } catch (err) {
        if (isError(err))
            console.error("Couldn't create a new game!", err.message)
        return false
    }

    redirect(`/game/${newGameState.gameId}`)
}

export async function drawCard(gameId: string, playerIdHex: string): Promise<boolean> {
    return gameId === playerIdHex
}

export async function checkPlayersTurn(gameId: string, playerIdHex: string): Promise<boolean> {
    return gameId === playerIdHex
}

export async function playCard(gameId: string, playerIdHex: string, card: Card): Promise<boolean> {
    return gameId === playerIdHex && card.cardId === 0
}

export async function getPlayersCards(gameId: string, playerIdHex: string): Promise<Card[]> {
    if (gameId === playerIdHex)
        return []

    return []
}