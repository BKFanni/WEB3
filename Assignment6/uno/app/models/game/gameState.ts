import { randomUUID } from "crypto"
import { Card } from "./card"
import { calculateNextPlayer, createDeck, shuffle } from "./gameUtils"
import { Player } from "./player"

export type GameState = {
    gameId: string
    name: string
    players: Player[]
    maxPlayers: number
    discardPile: Card[]
    drawPile?: Card[]
    currentPlayerIndex: number
    direction: number
    isGameOver: boolean
    createdAt: Date
}


/**
 * Creates a new game
 * @param playerNames player info who automatically join the game
 * @param gameName game name
 * @param maxPlayers max players in this game
 * @returns New game
 */
export function initializeGame(
    playerNames: {
        playerId: string
        name: string
        score?: number
    }[],
    gameName: string,
    maxPlayers?: number
): GameState {
    const deck = shuffle(createDeck());

    const players: Player[] = playerNames.map(plr => ({
        playerId: plr.playerId,
        name: plr.name,
        hand: deck.splice(0, 7),
        calledUno: false,
        score: plr.score ? plr.score : 0
    }));

    const discardPile = [deck.pop() as Card];
    const drawPile = deck;

    return {
        gameId: randomUUID(),
        name: gameName,
        players,
        discardPile,
        drawPile,
        direction: 1,
        currentPlayerIndex: 0,
        isGameOver: false,
        createdAt: new Date(),
        maxPlayers: maxPlayers ? maxPlayers : playerNames.length
    };
}

/**
 * Pick a card from the draw pile
 * @param state current game state
 * @param playerIndex player index who draws a card
 * @returns updated game state with player picking a card
 */
export function drawCard(
    state: GameState, playerIndex: number
): GameState {
    // We need draw pile info to continue
    if (state.drawPile === undefined)
        return state

    if (state.drawPile.length === 0)
        return state;

    const newDrawPile = [...state.drawPile];
    const drawnCard = newDrawPile.pop() as Card;

    const newPlayers = state.players.map((player, index) => {
            if (index !== playerIndex || player.hand === undefined)
                return player

            return { ...player, hand: [...player.hand, drawnCard], calledUno: false }
        }
    );

    return { ...state, drawPile: newDrawPile, players: newPlayers };
}

/**
 * Accuse player of not saying uno
 * @param state current game state
 * @param playerIndex accused player index
 * @returns New game state with accused result
 */
export function accuseUno(
    state: GameState, playerIndex: number
): GameState {
    const player = state.players[playerIndex];
    // We need player hand info to continue
    if (player.hand === undefined)
        return state

    if (player.calledUno || player.hand.length > 1)
        return state;

    // player didnt call uno, drawing 4 cards for the player
    let gameStateCopy = {...state}
    for (let i = 0; i < 4; i++) {
        gameStateCopy = drawCard(gameStateCopy, playerIndex)
    }

    return gameStateCopy
}

/**
 * Skip current player index's turn
 * @param state game
 * @returns GameState with incremented currentPlayerIndex
 */
export function skipTurn(state: GameState): GameState {
    return {
        ...state,
        // advancing to next player
        currentPlayerIndex: calculateNextPlayer(
            state.currentPlayerIndex,
            state.players.length,
            state.direction
        )
    }
}

/**
 * Start a new round using the current game
 * @param state Current game
 * @returns Current game with a new round
 */
export function newRound(state: GameState): GameState {
    const newGame = initializeGame(
        state.players,
        state.name,
        state.maxPlayers
    )
    newGame.createdAt = state.createdAt

    return newGame
}