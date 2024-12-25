import { randomUUID } from "crypto"
import { Card, CardType } from "./card"
import { calculateNextPlayer, createDeck, isCardPlayable, shuffle } from "./gameUtils"
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
 * Add a player to game. Throws if cant add player
 * @param player The player to add
 * @param game Game to add to
 */
export function addPlayer(
    player: {
        playerId: string
        name: string
        score?: number
    },
    game: GameState
): GameState {
    // Checking can player be added to game
    if (game.players.length >= game.maxPlayers)
        throw new Error("Game is full!")
    if (game.drawPile === undefined)
        throw new Error("Draw pile undefined!")
    for (let i = 0; i < game.players.length; i++) {
        const p = game.players[i];
        if (p.name === player.name || p.playerId === player.playerId)
            return game
    }

    // Copying game
    let gameCopy = {...game}
    gameCopy.drawPile = [...game.drawPile]
    gameCopy.discardPile = [...game.discardPile]

    // Creating the player
    const newPlayer: Player = {
        playerId: player.playerId,
        name: player.name,
        score: player.score ? player.score : 0,
        calledUno: false,
        hand: []
    }
    const newPlayerList = [...game.players]
    newPlayerList.push(newPlayer)
    gameCopy.players = newPlayerList
    // Adding cards
    for (let i = 0; i < 7; i++) {
        gameCopy = pickCard(gameCopy, gameCopy.players.length-1)
    }

    return gameCopy
}

/**
 * Pick a card from the draw pile
 * @param state current game state
 * @param playerIndex player index who draws a card
 * @returns updated game state with player picking a card
 */
export function pickCard(
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
        gameStateCopy = pickCard(gameStateCopy, playerIndex)
    }

    return gameStateCopy
}

/**
 * Plays the current player's card. Throws if invalid or couldn't find one in hand that matches
 * @param state the current game state
 * @param card the card to play
 */
export function playCurrentPlayerCard(state: GameState, card: Card): GameState {
    if (state.discardPile.length > 0 && !isCardPlayable(card, state.discardPile[state.discardPile.length-1]))
        throw new Error("Card not playable on game's last discardPile card!")
    const plrCards: Card[] | undefined = state.players[state.currentPlayerIndex].hand
    if (plrCards === undefined)
        throw new Error("Current player's hand is undefined!")

    let playerCardIndex = -1
    for (let i = 0; i < plrCards.length; i++) {
        if (plrCards[i].cardId === card.cardId)
            playerCardIndex = i
    }

    if (playerCardIndex < 0)
        throw new Error("Couldn't find matching card in player's hand!")

    // Creating a game copy
    let gameCopy = {...state}
    const newDiscardPile = [...state.discardPile]
    newDiscardPile.push(plrCards[playerCardIndex])
    plrCards.splice(playerCardIndex, 1)
    const newPlayer: Player = {...state.players[state.currentPlayerIndex], hand: plrCards}
    gameCopy.discardPile = newDiscardPile
    gameCopy.players[state.currentPlayerIndex] = newPlayer
    // Picking a new card after playing
    if (plrCards.length < 7)
        gameCopy = pickCard(gameCopy, state.currentPlayerIndex)

    if (card.cardType === CardType.WildDrawFour) {
        const affected = calculateNextPlayer(
            state.currentPlayerIndex, state.players.length, state.direction
        )
        for (let i = 0; i < 4; i++) {
            gameCopy = pickCard(gameCopy, affected)
        }
    } else if (card.cardType === CardType.DrawTwo) {
        const affected = calculateNextPlayer(
            state.currentPlayerIndex, state.players.length, state.direction
        )
        for (let i = 0; i < 2; i++) {
            gameCopy = pickCard(gameCopy, affected)
        }
    }

    gameCopy.currentPlayerIndex = calculateNextPlayer(
        state.currentPlayerIndex, state.players.length, state.direction, card.cardType
    )

    return gameCopy
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