import mongoose from "mongoose";
import { Card, CardType, Color } from "../game/card";

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

export function convertToCard(mongooseCard: unknown): Card {
    // Basic checks
    if (mongooseCard === null || mongooseCard === undefined || typeof mongooseCard !== "object")
        throw(new Error("Invalid mongoose card schema type! (null/undefined/not object)"))

    // Checking for necessary fields
    if (!(
        "cardId" in mongooseCard && "color" in mongooseCard && "cardType" in mongooseCard
    )) {
        throw(new Error("Invalid mongoose card schema type! (doesn't have necessary fields!)"))
    }

    // Type checks
    if (typeof mongooseCard.cardId !== "number")
        throw(new Error("Invalid mongoose card schema type! (cardId isn't number!)"))

    if (typeof mongooseCard.color !== "string")
        throw(new Error("Invalid mongoose card schema type! (color isn't string!)"))
    if (!(
        mongooseCard.color === "Red" || mongooseCard.color === "Blue" || mongooseCard.color === "Green"
        || mongooseCard.color === "Yellow" || mongooseCard.color === "Wild"
    )) {
        throw(new Error("Invalid mongoose card schema type! (color enum doesn't match!)"))
    }

    if (typeof mongooseCard.cardType !== "string")
        throw(new Error("Invalid mongoose card schema type! (cardType isn't string!)"))
    if (!(
        mongooseCard.cardType === "Number" || mongooseCard.cardType === "DrawTwo"
        || mongooseCard.cardType === "Skip" || mongooseCard.cardType === "Reverse"
        || mongooseCard.cardType === "Wild" || mongooseCard.cardType === "WildDrawFour"
    )) {
        throw(new Error("Invalid mongoose card schema type! (card type enum doesn't match!)"))
    }


    // Returning converted card
    if (!("value" in mongooseCard) || ("value" in mongooseCard && mongooseCard.value === undefined)) {
        // non number card
        return {
            cardId: mongooseCard.cardId,
            color: Color[mongooseCard.color],
            cardType: CardType[mongooseCard.cardType]
        }
    }

    if (typeof mongooseCard.value !== "number") {
        throw(new Error("Invalid mongoose card schema type! (Number card value type isn't number!)"))
    }

    // number card
    return {
        cardId: mongooseCard.cardId,
        color: Color[mongooseCard.color],
        cardType: CardType.Number,
        value: mongooseCard.value
    }
}