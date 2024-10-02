import { Card } from "./Card";
import { Hand, PlayerType } from "./Hand";
import { Uno } from "./Uno";

export function makeAMove(bot: Hand, uno: Uno) {
    let nextPlayer = uno.nextPlayer()
    let prevPlayer = uno.prevPlayer()

    // Accusing previous player to check if they made a mistake
    if (accusePlayer(bot.playerType, uno.cardAmount(prevPlayer))) {
        uno.accuseUno(prevPlayer)
    }

    let deck = uno.currentDeck
    let options: Card[] = []
    if (deck.currentColor === undefined || deck.placedCards.length === 0) {
        // deck is empty
        if (bot.playerType === PlayerType.HardBot) {
            // Hard bot wont place a special card as first card unless no other choice
            options = bot.cards.filter((c: Card) => {
                return c.value !== undefined // includes only number cards
            })
        }

        if (options.length === 0) {
            options = bot.cards
        }
    } else {
        // Deck is not empty
        options = bot.cards.filter((c: Card) => {
            if (c.type === "Wild" || c.type === "Wild Draw Four" || // wildcards
                c.color === deck.currentColor || // matches color
                c.value === deck.placedCards.lastItem.value // matches number
            ) {
                return true
            }

            return c.value !== undefined // includes only number cards
        })
    }

    let chosen: number = Math.floor(Math.random() * options.length);
    bot.playCard(chosen, deck)
    if (bot.cards.length <= 1 && deck.availableCards.length > 0) {
        bot.pickCard(deck)
    }
    if (bot.cards.length <= 1 && callUno(bot.playerType)) {
        uno.callUno(uno.currentPlayer)
    }
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