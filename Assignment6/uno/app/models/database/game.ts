import mongoose from 'mongoose';
import { convertToPlayer, playerSchema } from './player';
import { cardSchema, convertToCard } from './card';
import { GameState } from '../game/gameState';
import { Player } from '../game/player';
import { Card } from '../game/card';
import { isArray } from '../utils';

const gameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    players: [playerSchema],         // Array of players
    maxPlayers: {
        type: Number,
        required: true,
        default: 4
    },
    discardPile: [cardSchema],              // The discard pile of cards
    drawPile: [cardSchema],                 // The draw pile of cards
    currentPlayerIndex: {
        type: Number,
        required: true,
        default: 0
    },
    direction: {
        type: Number,
        required: true,
        default: 1    // 1 for clockwise, -1 for counterclockwise
    },
    isGameOver: {
        required: true,
        type: Boolean,
        default: false
    },
    createdAt: {
        required: true,
        type: Date,
        default: Date.now
    }
});

export const gameModel = mongoose.model('Game', gameSchema);

export function convertToGameState(mongooseGame: unknown): GameState {
    // Basic checks
    if (mongooseGame === null || mongooseGame === undefined || typeof mongooseGame !== "object")
        throw(new Error("Invalid mongoose game schema type! (null/undefined/not object)"))

    // Checking for necessary fields
    if (!(
        "gameId" in mongooseGame && "name" in mongooseGame && "players" in mongooseGame
        && "maxPlayers" in mongooseGame && "discardPile" in mongooseGame && "drawPile" in mongooseGame
        && "currentPlayerIndex" in mongooseGame && "direction" in mongooseGame && "isGameOver" in mongooseGame
        && "createdAt" in mongooseGame
    )) {
        throw(new Error("Invalid mongoose player schema type! (doesn't have necessary fields!)"))
    }

    // Type checks
    if (typeof mongooseGame.gameId !== "string")
        throw(new Error("Invalid mongoose game schema type! (gameId isn't string!)"))

    if (typeof mongooseGame.name !== "string")
        throw(new Error("Invalid mongoose game schema type! (name isn't string!)"))

    if (typeof mongooseGame.maxPlayers !== "number")
        throw(new Error("Invalid mongoose game schema type! (maxPlayers isn't number!)"))

    if (typeof mongooseGame.currentPlayerIndex !== "number")
        throw(new Error("Invalid mongoose game schema type! (currentPlayerIndex isn't number!)"))

    if (typeof mongooseGame.direction !== "number")
        throw(new Error("Invalid mongoose game schema type! (direction isn't number!)"))

    if (typeof mongooseGame.isGameOver !== "boolean")
        throw(new Error("Invalid mongoose game schema type! (isGameOver isn't boolean!)"))

    if (typeof mongooseGame.createdAt !== "object" || mongooseGame.createdAt === null
        || !(mongooseGame.createdAt instanceof Date)
    )
        throw(new Error("Invalid mongoose game schema type! (createdAt isn't Date!)"))

    // Checking arrays
    if (mongooseGame.players === null || typeof mongooseGame.players !== "object"
        || !isArray(mongooseGame.players))
        throw(new Error("Invalid mongoose game schema type! (players isn't mongoose document array)"))
    
    if (mongooseGame.discardPile === null || typeof mongooseGame.discardPile !== "object"
        || !isArray(mongooseGame.discardPile))
        throw(new Error("Invalid mongoose game schema type! (discardPile isn't mongoose document array)"))
    
    if (mongooseGame.drawPile === null || typeof mongooseGame.drawPile !== "object"
        || !isArray(mongooseGame.drawPile))
        throw(new Error("Invalid mongoose game schema type! (drawPile isn't mongoose document array)"))

    const players: Player[] = []
    mongooseGame.players.forEach(p => {
        players.push(convertToPlayer(p))
    });

    const discardPile: Card[] = []
    mongooseGame.discardPile.forEach(c => {
        discardPile.push(convertToCard(c))
    });

    const drawPile: Card[] = []
    mongooseGame.drawPile.forEach(c => {
        drawPile.push(convertToCard(c))
    });

    return {
        gameId: mongooseGame.gameId,
        name: mongooseGame.name,
        players: players,
        maxPlayers: mongooseGame.maxPlayers,
        discardPile: discardPile,
        drawPile: drawPile,
        currentPlayerIndex: mongooseGame.currentPlayerIndex,
        direction: mongooseGame.direction,
        isGameOver: mongooseGame.isGameOver,
        createdAt: mongooseGame.createdAt
    }
}