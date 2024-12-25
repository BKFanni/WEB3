import mongoose from "mongoose";
import { cardSchema, convertToCard } from "./card";
import { Player } from "../game/player";
import { Card } from "../game/card";
import { isArray } from "../utils";

export const playerSchema = new mongoose.Schema({
    playerId: { // Player User Hex
        type: String,
        required: true
    },
    name: { // Player game name
        type: String,
        required: true
    },
    hand: [cardSchema],       // Cards in the player's hand
    score: {
        type: Number,
        default: 0
    },
    calledUno: {
        type: Boolean,
        default: false
    }
});

export function convertToPlayer(mongoosePlayer: unknown): Player {
    // Basic checks
    if (mongoosePlayer === null || mongoosePlayer === undefined || typeof mongoosePlayer !== "object")
        throw(new Error("Invalid mongoose player schema type! (null/undefined/not object)"))

    // Checking for necessary fields
    if (!(
        "playerId" in mongoosePlayer && "name" in mongoosePlayer && "hand" in mongoosePlayer
        && "score" in mongoosePlayer && "calledUno" in mongoosePlayer
    )) {
        throw(new Error("Invalid mongoose player schema type! (doesn't have necessary fields!)"))
    }

    // Type checks
    if (typeof mongoosePlayer.playerId !== "string")
        throw(new Error("Invalid mongoose player schema type! (playerId isn't string!)"))

    if (typeof mongoosePlayer.name !== "string")
        throw(new Error("Invalid mongoose player schema type! (name isn't string!)"))

    if (typeof mongoosePlayer.score !== "number")
        throw(new Error("Invalid mongoose player schema type! (score isn't number!)"))

    if (typeof mongoosePlayer.calledUno !== "boolean")
        throw(new Error("Invalid mongoose player schema type! (calledUno isn't boolean!)"))

    if (mongoosePlayer.hand === null || typeof mongoosePlayer.hand !== "object"
        || !isArray(mongoosePlayer.hand))
        throw(new Error("Invalid mongoose player schema type! (hand isn't mongoose document array)"))

    const handCards: Card[] = []
    mongoosePlayer.hand.forEach(c => {
        handCards.push(convertToCard(c))
    });

    return {
        playerId: mongoosePlayer.playerId,
        name: mongoosePlayer.name,
        calledUno: mongoosePlayer.calledUno,
        score: mongoosePlayer.score,
        hand: handCards
    }
}