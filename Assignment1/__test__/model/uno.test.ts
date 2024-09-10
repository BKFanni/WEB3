import { describe, it, test, expect } from '@jest/globals'
import { createGame } from '../utils/test_adapter'
import { shuffleBuilder, successiveShufflers } from '../utils/shuffling'
import { Game } from '../../src/model/uno'

describe("Game set up", () => {
  const game: Game = createGame({players: ['a', 'b', 'c', 'd'], targetScore: 500})
  it("has as many players as set in the properties", () => {
    expect(game.playerCount).toBe(4)
  })
  it("has the players set in the properties", () => {
    expect(game.player(0)).toBe('a')
    expect(game.player(1)).toBe('b')
    expect(game.player(2)).toBe('c')
    expect(game.player(3)).toBe('d')
  })
  it("has 'A' and 'B' as the default players", () => {
    const game: Game = createGame({targetScore: 500})
    expect(game.playerCount).toBe(2)
    expect(game.player(0)).toBe('A')
    expect(game.player(1)).toBe('B')
  })
  it("has the target score set in the properties", () => {
    expect(game.targetScore).toBe(500)
  })
  it("has 500 as the default target score", () => {
    const game: Game = createGame({players: ['a', 'b', 'c', 'd']})
    expect(game.targetScore).toBe(500)
  })
  it("starts with all players at 0 score", () => {
    expect(game.score(0)).toBe(0)
    expect(game.score(1)).toBe(0)
    expect(game.score(2)).toBe(0)
    expect(game.score(3)).toBe(0)
  })
  it("has no winner", () => {
    expect(game.winner()).toBeUndefined();
  })
  it("requires at least 2 players", () => {
    expect(() => createGame({players: ['a'], targetScore: 500})).toThrow()
  })
  it("requires a target score of more than 0", () => {
    expect(() => createGame({players: ['a', 'b', 'c', 'd'], targetScore: 0})).toThrow()
  })
  it("requires player index to be in bounds", () => {
    expect(() => game.player(-1)).toThrow()
    expect(() => game.player(4)).toThrow()
  })
  it("starts a hand", () => {
    expect(game.currentHand()).toBeDefined()
  })
  it("doesn't start a new hand if no action is taken", () => {
    const hand = game.currentHand()
    expect(game.currentHand()).toBe(hand)
  })
  it("selects a random player as dealer", () => {
    const game: Game = createGame({players: ['a', 'b', 'c', 'd'], targetScore: 500, randomizer: () => 1})
    expect(game.currentHand()?.dealer).toBe(1)
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
  describe("while the hand is still running", () => {
    const game = createGame(props)
    const hand = game.currentHand()!
    hand.draw()
    test("no winner has been found", () => {
      expect(game.winner()).toBeUndefined()
    })
    test("the score is unchanged", () => {
      expect(game.score(0)).toBe(0)
      expect(game.score(1)).toBe(0)
      expect(game.score(2)).toBe(0)
      expect(game.score(3)).toBe(0)
    })
    test("the hand is the same", () => {
      expect(game.currentHand()).toBe(hand)
    })
  })
  describe("when the hand is over", () => {
    const game = createGame(props)
    const hand = game.currentHand()!
    hand.draw()
    hand.play(0)
    test("the setup is as expected", () => {
      expect(hand.hasEnded()).toBeTruthy()
      expect(hand.winner()).toEqual(1)
      expect(hand.score()).toEqual(78)
    })
    test("the game still has no winner", () => {
      expect(game.winner()).toBeUndefined()
    })
    test("the score is updated", () => {
      expect(game.score(0)).toBe(0)
      expect(game.score(1)).toBe(78)
      expect(game.score(2)).toBe(0)
      expect(game.score(3)).toBe(0)
    })
    test("a new hand is started", () => {
      expect(game.currentHand()).not.toBe(hand)
    })
  })
})

const secondShuffle = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
  .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
  .hand(0).is({ number: 8 })
  .hand(1).is({ color: 'GREEN', type: 'DRAW' })
  .hand(2).is({ type: 'WILD DRAW' })
  .hand(3).is({ number: 3 })
  .build()

describe("ending the second hand", () => {
  const props = {
    players: ['a', 'b', 'c', 'd'],
    targetScore: 200,
    randomizer: () => 3,
    shuffler: successiveShufflers(firstShuffle, secondShuffle),
    cardsPerPlayer: 1
  }
  const game = createGame(props)
  const hand1 = game.currentHand()!
  hand1.draw()
  hand1.play(0)
  const hand2 = game.currentHand()!
  hand2.play(0)

  test("set up is as expected", () => {
    expect(hand2).not.toBe(hand1)
    expect(hand2.hasEnded()).toBeTruthy()
    expect(hand2.winner()).toBe(0)
    expect(hand2.score()).toBe(73)
  })
  test("the game still has no winner", () => {
    expect(game.winner()).toBeUndefined()
  })
  test("the score is updated", () => {
    expect(game.score(0)).toBe(73)
    expect(game.score(1)).toBe(78)
    expect(game.score(2)).toBe(0)
    expect(game.score(3)).toBe(0)
  })
  test("a new hand is started", () => {
    expect(game.currentHand()).not.toBe(hand1)
    expect(game.currentHand()).not.toBe(hand2)
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

describe("ending the second hand", () => {
  const props = {
    players: ['a', 'b', 'c', 'd'],
    targetScore: 200,
    randomizer: () => 3,
    shuffler: successiveShufflers(firstShuffle, secondShuffle, thirdShuffle),
    cardsPerPlayer: 1
  }
  const game = createGame(props)
  const hand1 = game.currentHand()!
  hand1.draw()
  hand1.play(0)
  const hand2 = game.currentHand()!
  hand2.play(0)
  const hand3 = game.currentHand()!
  hand3.play(0)

  test("set up is as expected", () => {
    expect(hand3).not.toBe(hand1)
    expect(hand3).not.toBe(hand2)
    expect(hand3.hasEnded()).toBeTruthy()
    expect(hand3.winner()).toBe(0)
    expect(hand3.score()).toBe(143)
  })
  test("player 0 won", () => {
    expect(game.winner()).toEqual(0)
  })
  test("the score is updated", () => {
    expect(game.score(0)).toBe(216)
    expect(game.score(1)).toBe(78)
    expect(game.score(2)).toBe(0)
    expect(game.score(3)).toBe(0)
  })
  test("a new hand is not started", () => {
    expect(game.currentHand()).toBeUndefined()
  })
})  