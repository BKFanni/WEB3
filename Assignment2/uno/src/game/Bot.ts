import { Card, CardColor } from "./Card";
import { Deck } from "./Deck";
import { Hand, PlayerType } from "./Hand";
import { Uno } from "./Uno";

/**
 * Calculate and make a move by a bot player. Returns placed card
 * @param bot The bot
 * @param uno Game to affect
 */
export function makeAMove(bot: Hand, uno: Uno): Card {
    let prevPlayer = uno.prevPlayer()

    // Accusing previous player to check if they made a mistake
    if (accusePlayer(bot.playerType, uno.cardAmount(prevPlayer))) {
        uno.accuseUno(prevPlayer)
    }

    let deck = uno.currentDeck
    let options: {index: number, card: Card}[] = cardOptions(bot, deck)
    if (options.length < 1) {
        // no available cards, checking if bot will pick one
        bot.pickCard(deck)
        options = cardOptions(bot, deck)
    }
    if (options.length < 1) {
        // still no available cards, skipping
        return undefined
    }

    let chosen: number = Math.floor(Math.random() * options.length);
    // Setting wild card colour if chosen
    if (options[chosen].card.type === "Wild" || options[chosen].card.type === "Wild Draw Four") {
        bot.changeWildcardColor(options[chosen].index, Math.floor(Math.random() * 4))
        if (bot.playerType === PlayerType.HardBot) {
            // Hard bot doesnt set the same color
            while (bot.cards[options[chosen].index].color === deck.currentColor) {
                bot.changeWildcardColor(chosen, Math.floor(Math.random() * 4))
            }
        }
    }

    let chosenCard = options[chosen].card
    bot.playCard(options[chosen].index, deck)
    if (bot.cards.length <= 1 && callUno(bot.playerType)) {
        uno.callUno(uno.currentPlayer)
    }
    return chosenCard
}

/**
 * Goes through bot's hand and compares what cards are available to use
 * @param bot The bot
 * @param deck The deck to compare cards against
 */
const cardOptions = (bot: Hand, deck: Deck): {index: number, card: Card}[] => {
    let options: {index: number, card: Card}[] = bot.cards.map((c: Card, i: number) => {
        return {index: i, card: c}
    })

    // checking deck is empty
    if (deck.currentColor === undefined || deck.placedCards.length === 0) {
        if (bot.playerType === PlayerType.HardBot) {
            // Hard bot wont place a special card as first card unless no other choice
            options = options.filter((c) => {
                return c.card.value !== undefined // includes only number cards
            })
        }

        if (options.length === 0) {
            options = bot.cards.map((c: Card, i: number) => {
                return {index: i, card: c}
            })
        }
        return options
    }

    // Deck is not empty
    options = options.filter((c) => {
        if (c.card.type === "Wild" || c.card.type === "Wild Draw Four" || // wildcards
            c.card.color === deck.currentColor || // matches color
            c.card.value === deck.placedCards.lastItem.value // matches number
        ) {
            return true
        }

        return false
    })

    return options
}

/**
 * Whether to accuse the player based on bot's difficulty
 * @param botType Bot's difficulty
 * @param accusedCardAmount How many cards does the accused hold
 * @returns True if the bot should accuse the player
 */
const accusePlayer = (botType: PlayerType, accusedCardAmount: number): boolean => {
    if (botType === PlayerType.Player || botType === PlayerType.EasyBot || accusedCardAmount !== 1) {
        return false
    }

    let r: number = Math.random()
    if (botType === PlayerType.HardBot && r <= 0.8) {
        return true
    }
    if (botType === PlayerType.MediumBot && r <= 0.5) {
        return true
    }

    return false
}

/**
 * Whether to call Uno based on bot's difficulty
 */
const callUno = (botType: PlayerType): boolean => {
    let rand = Math.random()
    if (botType === PlayerType.EasyBot || botType === PlayerType.Player) {
        return rand <= 0.25
    } else if (botType === PlayerType.MediumBot) {
        return rand <= 0.5
    } else if (botType === PlayerType.HardBot) {
        return rand <= 0.8
    }

    return false
}