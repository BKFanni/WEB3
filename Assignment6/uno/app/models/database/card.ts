import mongoose from "mongoose";

export const cardSchema = new mongoose.Schema({
    cardId: {
        type: Number,
        required: true
    },
    color: {
        required: true,
        type: String,
        enum: ["Red", "Blue", "Green", "Yellow", "Wild"],
        default: "Wild"
    },
    cardType: {
        required: true,
        type: String,
        enum: ["Number", "DrawTwo", "Skip", "Reverse", "Wild", "WildDrawFour"],
        default: "Wild"
    },
    value: Number
})