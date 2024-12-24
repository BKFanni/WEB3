import mongoose from "mongoose";
import { cardSchema } from "./card";

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