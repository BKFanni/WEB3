"use server"

import { convertToGameState, gameModel } from "@/app/models/database/game"
import { Card } from "@/app/models/game/card"
import { addPlayer, GameState, initializeGame, pickCard, playCurrentPlayerCard } from "@/app/models/game/gameState"
import { isError } from "@/app/models/utils"
import { redirect } from "next/navigation"
import { connectToDatabase } from "../db-connection"
import { calculateNextPlayer, removeGameStateSecrets } from "@/app/models/game/gameUtils"

export async function joinGame(gameId: string, playerIdHex: string, username: string) {
    try {
        // Database stuff
        await connectToDatabase()

        const game = await gameModel.findOne({ gameId })
        if (!game) {
            console.log("Game not found:", gameId)
            return
        }
        let convertedGame = convertToGameState(game)

        // Adding player
        convertedGame = addPlayer({playerId: playerIdHex, name: username}, convertedGame) 
        game.set(convertedGame)
        await game.save()
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
        await connectToDatabase()

        const games = await gameModel.find()
        const convertedGames: GameState[] = []
        games.forEach(g => {
            const converted = convertToGameState(g)
            convertedGames.push(removeGameStateSecrets(converted))
        });

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
        await connectToDatabase()

        const game = await gameModel.findOne({ gameId })
        if (!game) {
            console.log("Game not found:", gameId)
            return
        }

        const convertedGame = convertToGameState(game)
        const safeGame = removeGameStateSecrets(convertedGame)
        
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
        await connectToDatabase()

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
    } catch (err) {
        if (isError(err))
            console.error("Couldn't create a new game!", err.message)
        return false
    }

    redirect(`/game/${newGameState.gameId}`)
}

export async function drawCard(gameId: string, playerIdHex: string): Promise<boolean> {
    try {
        // Database stuff
        await connectToDatabase()

        const game = await gameModel.findOne({ gameId })
        if (!game) {
            console.log("Game not found:", gameId)
            return false
        }

        let convertedGame = convertToGameState(game)
        // Not player's turn
        if (convertedGame.players[convertedGame.currentPlayerIndex].playerId !== playerIdHex) {
            console.log(`Current player id (${convertedGame.players[convertedGame.currentPlayerIndex].playerId}) doesn't match player id ${playerIdHex}!`)
            return false
        }
        if (convertedGame.players.length < 2) {
            console.log(`Not enough players!`)
            return false
        }

        convertedGame = pickCard(convertedGame, convertedGame.currentPlayerIndex)
        convertedGame.currentPlayerIndex = calculateNextPlayer(
            convertedGame.currentPlayerIndex,
            convertedGame.players.length,
            convertedGame.direction
        )
        game.set(convertedGame)
        await game.save()
        
        return true
    } catch (err) {
        if (isError(err))
            console.error(`Couldn't pick a new card for player ${playerIdHex} in game ${gameId}!`, err.message)
        return false
    }
}

export async function checkPlayersTurn(gameId: string, playerIdHex: string): Promise<boolean> {
    try {
        // Database stuff
        await connectToDatabase()

        const game = await gameModel.findOne({ gameId })
        if (!game) {
            console.log("Game not found:", gameId)
            return false
        }

        const convertedGame = convertToGameState(game)
        if (convertedGame.players.length < 2) {
            console.log(`Not enough players!`)
            return false
        }
        
        return convertedGame.players[convertedGame.currentPlayerIndex].playerId === playerIdHex
    } catch (err) {
        if (isError(err))
            console.error(`Couldn't check ${playerIdHex} player's turn for game ${gameId}!`, err.message)
        return false
    }
}

export async function playCard(gameId: string, playerIdHex: string, card: Card): Promise<boolean> {
    try {
        // Database stuff
        await connectToDatabase()

        const game = await gameModel.findOne({ gameId })
        if (!game) {
            console.log("Game not found:", gameId)
            return false
        }

        let convertedGame = convertToGameState(game)
        // Not player's turn
        if (convertedGame.players[convertedGame.currentPlayerIndex].playerId !== playerIdHex) {
            console.log(`Current player id (${convertedGame.players[convertedGame.currentPlayerIndex].playerId}) doesn't match player id ${playerIdHex}!`)
            return false
        }
        if (convertedGame.players.length < 2) {
            console.log(`Not enough players!`)
            return false
        }

        convertedGame = playCurrentPlayerCard(convertedGame, card)
        game.set(convertedGame)
        await game.save()
        
        return true
    } catch (err) {
        if (isError(err))
            console.error(`Couldn't play ${playerIdHex} player's card for game ${gameId}!`, err.message)
        return false
    }
}

export async function getPlayersCards(gameId: string, playerIdHex: string): Promise<Card[]> {
    try {
        // Database stuff
        await connectToDatabase()

        const game = await gameModel.findOne({ gameId })
        if (!game) {
            console.log("Game not found:", gameId)
            return []
        }

        const convertedGame = convertToGameState(game)
        let cards: Card[] = []
        for (let i = 0; i < convertedGame.players.length; i++) {
            const player = convertedGame.players[i]
            if (player.playerId !== playerIdHex || player.hand === undefined)
                continue

            cards = player.hand
        }

        return cards
    } catch (err) {
        if (isError(err))
            console.error(`Couldn't get ${playerIdHex} player's cards!`, err.message)
        return []
    }
}