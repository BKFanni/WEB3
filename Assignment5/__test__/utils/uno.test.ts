import { describe, it, test, expect } from '@jest/globals'
import { createGame } from './test_adapter'
import { shuffleBuilder, successiveShufflers } from '../utils/shuffling'
import { Game, play } from '../../src/model/uno'
import * as Hand from '../../src/model/hand'
import { Color } from '../../src/model/deck'
import { pipeActions } from './game'

const handPlay = (index: number, color?: Color) => (h: Hand.Hand) => Hand.play(index, color, h)

describe("Game set up", () => {
  const game: Game = createGame({players: ['a', 'b', 'c', 'd'], targetScore: 200})
  it("has as many players as set in the properties", () => {
    expect(game.playerCount).toEqual(4)
  })
  it("has the players set in the properties", () => {
    expect(game.players).toEqual(['a', 'b', 'c', 'd'])
  })
  it("has 'A' and 'B' as the default players", () => {
    const game: Game = createGame({})
    expect(game.playerCount).toEqual(2)
    expect(game.players).toEqual(['A', 'B'])
  })
  it("has the target score set in the properties", () => {
    expect(game.targetScore).toEqual(200)
  })
  it("has 500 as the default target score", () => {
    const game: Game = createGame({players: ['a', 'b', 'c', 'd']})
    expect(game.targetScore).toEqual(500)
  })
  it("starts with all players at 0 score", () => {
    expect(game.scores).toEqual([0, 0, 0, 0])
  })
  it("has no winner", () => {
    expect(game.winner).toBeUndefined();
  })
  it("requires at least 2 players", () => {
    expect(() => createGame({players: ['a']})).toThrow()
  })
  it("requires a target score of more than 0", () => {
    expect(() => createGame({players: ['a', 'b', 'c', 'd'], targetScore: 0})).toThrow()
  })
  it("starts a hand", () => {
    expect(game.currentHand).toBeDefined()
  })
  it("selects a random player as dealer", () => {
    const game: Game = createGame({players: ['a', 'b', 'c', 'd'], randomizer: () => 1})
    expect(game.currentHand?.dealer).toEqual(1)
  })
})

const firstShuffle = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
  .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
  .hand(0).is({ color: 'GREEN', type: 'DRAW' })
  .hand(1).is({ number: 8 })
  .hand(2).is({ type: 'WILD DRAW' })
  .hand(3).is({ number: 3 })
  .drawPile().is({ color: 'GREEN', number: 5 })
  .build()

describe("Playing a hand", () => {
  const props = {
    players: ['a', 'b', 'c', 'd'],
    targetScore: 200,
    randomizer: () => 3,
    shuffler: firstShuffle,
    cardsPerPlayer: 1
  }
  const startGame = createGame(props)
  describe("while the hand is still running", () => {
    const startingHand = startGame.currentHand!
    const game = play(Hand.draw, startGame)
    test("no winner has been found", () => {
      expect(game.winner).toBeUndefined()
    })
    test("the score is unchanged", () => {
      expect(game.scores).toEqual([0, 0, 0, 0])
    })
    test("the hand is the same", () => {
      expect(game.currentHand).toEqual(Hand.draw(startingHand))
    })
  })
  describe("when the hand is over", () => {
    const game = play(pipeActions(Hand.draw, handPlay(0)), startGame)
    test("the game still has no winner", () => {
      expect(game.winner).toBeUndefined()
    })
    test("the score is updated", () => {
      expect(game.scores).toEqual([0, 78, 0, 0])
    })
    test("a new hand is started", () => {
      expect(Hand.hasEnded(game.currentHand!)).toBeFalsy
    })
  })
})

const secondShuffle = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
  .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
  .hand(0).is({ color: 'YELLOW', number: 3 })
  .hand(1).is({ number: 8 })
  .hand(2).is({ color: 'GREEN', type: 'DRAW' })
  .hand(3).is({ type: 'WILD DRAW' })
  .drawPile().is({ type: 'NUMBERED', color: 'RED', number: 0})
  .build()

describe("ending the second hand", () => {
  const props = {
    players: ['a', 'b', 'c', 'd'],
    targetScore: 200,
    randomizer: () => 3,
    shuffler: successiveShufflers(firstShuffle, secondShuffle),
    cardsPerPlayer: 1
  }
  const startGame = createGame(props)
  const game1 = play(pipeActions(Hand.draw, handPlay(0)), startGame)
  const game2 = play(pipeActions(Hand.draw, handPlay(0)), game1)

  test("the game still has no winner", () => {
    expect(game2.winner).toBeUndefined()
  })
  test("the score is updated", () => {
    expect(game2.scores).toEqual([ 0, 78, 73, 0 ])
  })
  test("a new hand is started", () => {
    expect(Hand.hasEnded(game2.currentHand!)).toBeFalsy
  })
})

const thirdShuffle = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
  .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
  .hand(0).is({ color: 'BLUE', type: 'DRAW' })
  .hand(1).is({ type: 'WILD DRAW' })
  .hand(2).is({ type: 'SKIP', color: 'GREEN' })
  .hand(3).is({ number: 3 })
  .drawPile().is({ type: 'WILD' }, { type: 'REVERSE' })
  .build()

describe("ending the third hand", () => {
  const props = {
    players: ['a', 'b', 'c', 'd'],
    targetScore: 200,
    randomizer: () => 3,
    shuffler: successiveShufflers(firstShuffle, secondShuffle, thirdShuffle),
    cardsPerPlayer: 1
  }
  const startGame = createGame(props)
  const game1 = play(pipeActions(Hand.draw, handPlay(0)), startGame)
  const game2 = play(pipeActions(Hand.draw, handPlay(0)), game1)
  const game3 = play(handPlay(0), game2)
  const game = createGame(props)

  test("player 0 won", () => {
    expect(game3.winner).toEqual(2)
  })
  test("the score is updated", () => {
    expect(game3.scores).toEqual([ 0, 78, 216, 0 ])
  })
  test("a new hand is not started", () => {
    expect(game3.currentHand).toBeUndefined()
  })
})  