import { describe, it, test, expect } from '@jest/globals'
import { createHand} from '../../__test__/utils/test_adapter'
import type { Hand } from '../../src/model/hand'
import { canPlay as canPlayUncurry, 
         catchUnoFailure as catchUnoUncurry, 
         sayUno as sayUnoUncurry,
         checkUnoFailure, 
         draw, 
         play as playUncurry, 
         hasEnded,
         winner,
         canPlayAny,
         score} from '../../src/model/hand'
import { deterministicShuffle, shuffleBuilder, successiveShufflers } from '../utils/shuffling'
import * as R from 'ramda'
import { applyActions } from '../utils/game'
import { createInitialDeck } from '../../src/model/deck'
import { standardShuffler } from '../../src/utils/random_utils'

const play = R.curry(playUncurry)
const canPlay = R.curry(canPlayUncurry)
const catchUnoFailure = R.curry(catchUnoUncurry)
const sayUno = R.curry(sayUnoUncurry)

describe('catching failure to say "UNO!"', () => {
  const builder = shuffleBuilder({players: 4, cardsPerPlayer: 2})
    .discard().is({type: 'NUMBERED', color: 'YELLOW', number: 0})
    .drawPile()
      .is({type: 'NUMBERED', color: 'BLUE', number: 0})
      .is({type: 'NUMBERED', color: 'RED', number: 2})
      .is({type: 'NUMBERED', color: 'RED', number: 3})
      .is({type: 'NUMBERED', color: 'RED', number: 5})
    .hand(0).is({type: 'NUMBERED', color: 'BLUE', number: 8}, {type: 'SKIP', color: 'BLUE'})
    .hand(1).is({type: 'NUMBERED', color: 'RED', number: 8}, {type: 'SKIP', color: 'GREEN'})
    .hand(2).is({type: 'NUMBERED', color: 'GREEN', number: 8}, {type: 'DRAW', color: 'RED'})
    .hand(3).is({type: 'NUMBERED', color: 'RED', number: 4}, {type: 'REVERSE', color: 'RED'})

    describe("single UNO scenario", () => {
      const shuffler = builder.build()
      const hand: Hand = applyActions(createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 2}),
        draw,
        play(2, undefined),
        draw,
        draw,
        draw
      )
    test("set up is as expected", () => {
      expect(hand.hands[0].length).toEqual(2)
      expect(hand.hands[1].length).toEqual(3)
      expect(hand.hands[2].length).toEqual(3)
      expect(hand.hands[3].length).toEqual(3)
      expect(hand.playerInTurn).toEqual(0)
      expect(canPlay(0, hand)).toBeTruthy()
    })
    it("fails if the player hasn't played penultimate card", () => {
      expect(checkUnoFailure({accuser: 1, accused: 0}, hand)).toBeFalsy()
    })
    it("succeeds if the player has one card and hasn't said 'UNO!'", () => {
      const res = play(0, undefined, hand)
      expect(checkUnoFailure({accuser: 1, accused: 0}, res)).toBeTruthy()
    })
    it("adds 4 cards to the hand of the accused player if successful", () => {
      const res = applyActions(hand, 
        play(0, undefined), 
        catchUnoFailure({accuser: 1, accused: 0}))
      expect(res.hands[0].length).toEqual(5)
    })
    it("takes the added cards from the draw pile", () => {
      const drawPileSize = hand.drawPile.length
      const res = applyActions(hand, 
        play(0, undefined), 
        catchUnoFailure({accuser: 1, accused: 0}))
      expect(res.drawPile.length).toBe(drawPileSize - 4)
    })
    it("succeeds irrespective of the accuser", () => {
      const res = play(0, undefined, hand)
      expect(checkUnoFailure({accuser: 2, accused: 0}, res)).toBeTruthy()
    })
    it("fails if the next player has already played", () => {
      const res = applyActions(hand, 
        play(0, undefined), 
        play(0, undefined))
      expect(checkUnoFailure({accuser: 3, accused: 0}, res)).toBeFalsy()
    })
    it("fails if the next player has drawn a card", () => {
      const res = applyActions(hand, 
        play(1, undefined), 
        draw)
      expect(checkUnoFailure({accuser: 3, accused: 0}, res)).toBeFalsy()
    })
    it("cannot be applied twice", () => {
      const res = applyActions(hand, 
        play(0, undefined), 
        catchUnoFailure({accuser: 2, accused: 0}))
      expect(checkUnoFailure({accuser: 2, accused: 0}, res)).toBeFalsy()
    })
    it("can succeed after first accusing the wrong player", () => {
      const res = play(0, undefined, hand)
      expect(checkUnoFailure({accuser: 2, accused: 1}, res)).toBeFalsy()
      expect(checkUnoFailure({accuser: 2, accused: 0}, res)).toBeTruthy()
    })
    it("fails if the accused has said 'UNO!' before playing", () => {
      const res = applyActions(hand,
        sayUno(0),
        play(0, undefined))
      expect(checkUnoFailure({accuser: 2, accused: 0}, res)).toBeFalsy()
    })
    it("fails if the accused has said 'UNO!' after playing but before the accusation", () => {
      const res = applyActions(hand,
        play(0, undefined),
        sayUno(0))
      expect(checkUnoFailure({accuser: 2, accused: 0}, res)).toBeFalsy()
    })
    it("still succeeds if the player has said 'UNO!' before another players turn", () => {
      const hand: Hand = applyActions(createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 2}),
      draw,
      play(2, undefined),
      draw,
      draw,
      sayUno(0),
      draw,
      play(0, undefined))
      expect(checkUnoFailure({accuser: 1, accused: 0}, hand)).toBeTruthy()    
    })
  })

  describe("emptying the draw pile", () => {
    builder.hand(3).is({type: 'NUMBERED', color: 'BLUE', number: 4}, {type: 'REVERSE', color: 'RED'})
    const shuffler = builder.build()
    const cards = shuffler(createInitialDeck()).slice(0, 14)
    const hand = applyActions(createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler: successiveShufflers(deterministicShuffle(cards), standardShuffler), cardsPerPlayer: 2}),
      draw,
      play(2, undefined),
      draw,
      draw,
      sayUno(3),
      play(0, undefined)
    )
    test("set up is as expected", () => {
      expect(hand.hands[0].length).toEqual(2)
      expect(hand.hands[1].length).toEqual(3)
      expect(hand.hands[2].length).toEqual(3)
      expect(hand.hands[3].length).toEqual(1)
      expect(hand.playerInTurn).toEqual(0)
      expect(canPlay(0, hand)).toBeTruthy()
      expect(hand.drawPile.length).toEqual(2)
      expect(hand.discardPile.length).toEqual(3)
    })
    test("adding 4 cards to the hand shuffles the draw pile if necessary", () => {
      const res = play(0, undefined, hand)
      expect(res.hands[0].length).toBe(1)
      expect(res.drawPile.length).toEqual(2)
      expect(res.discardPile.length).toEqual(4)
      const final = catchUnoFailure({accuser: 1, accused: 0}, res)
      expect(final.hands[0].length).toBe(5)
      expect(final.drawPile.length).toEqual(1)
      expect(final.discardPile.length).toEqual(1)
    })
  })

  describe("Multi UNO scenario", () => {
    builder.hand(3).is({type: 'NUMBERED', color: 'BLUE', number: 4}, {type: 'REVERSE', color: 'RED'})
    const shuffler = builder.build()
    const cards = shuffler(createInitialDeck()).slice(0, 14)
    const hand = applyActions(createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler: deterministicShuffle(cards), cardsPerPlayer: 2}),
      draw,
      play(2, undefined),
      draw,
      draw,
    )
    test("set up is as expected", () => {
      expect(hand.hands[0].length).toEqual(2)
      expect(hand.hands[1].length).toEqual(3)
      expect(hand.hands[2].length).toEqual(3)
      expect(hand.hands[3].length).toEqual(2)
      expect(hand.playerInTurn).toEqual(3)
      expect(canPlay(0, hand)).toBeTruthy()
      const res = play(0, undefined, hand)
      expect(canPlay(0, res)).toBeTruthy()
    })
    it("still succeeds if the player has said 'UNO!' before another player plays", () => {
      const res = applyActions(hand,
        sayUno(0),
        sayUno(3),
        play(0, undefined),
        play(0, undefined)
      )
      expect(checkUnoFailure({accuser: 1, accused: 0}, res)).toBeTruthy()    
    })
    it("still fails even if another player says 'UNO!' after", () => {
      const res = applyActions(hand,
        play(0, undefined),
        sayUno(0),
        sayUno(3),
        play(0, undefined)
      )
      expect(checkUnoFailure({accuser: 1, accused: 0}, res)).toBeFalsy()    
    })
    it("still fails even if another player has already said 'UNO!'", () => {
      const res = applyActions(hand,
        play(0, undefined),
        sayUno(0),
        sayUno(3)
      )
      expect(checkUnoFailure({accuser: 1, accused: 3}, res)).toBeFalsy()    
    })
  })

  describe("boundaries", () => {
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 2})
    test("accused cannot be negative", () => {
      expect(() => checkUnoFailure({accused: -1, accuser: 0}, hand)).toThrow()
      expect(() => catchUnoFailure({accused: -1, accuser: 0}, hand)).toThrow()
    })
    test("accused cannot be beyond the player count", () => {
      expect(() => checkUnoFailure({accused: 4, accuser: 0}, hand)).toThrow()
      expect(() => catchUnoFailure({accused: 4, accuser: 0}, hand)).toThrow()
    })
    test("the player saying 'UNO!' cannot be negative", () => {
      expect(() => sayUno(-1, hand)).toThrow()
    })
    test("the player saying 'UNO!' cannot be beyond the player count", () => {
      expect(() => sayUno(4, hand)).toThrow()
    })
  })
})

describe("ending the hand", () => {
  describe("before playing the last card", () => {
    const shuffler = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
      .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
      .hand(0).is({ type: 'NUMBERED', color: 'GREEN', number: 8 })
      .hand(1).is({ type: 'NUMBERED', color: 'GREEN', number: 4 })
      .build()
    const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 1})
    it("returns false from hasEnded()", () => {
      expect(hasEnded(hand)).toBeFalsy()
    })
    it("doesn't return a winner", () => {
      expect(winner(hand)).toBeUndefined();
    })
  })

  describe("playing the last card", () => {
    const shuffler = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
      .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
      .hand(0).is({ type: 'NUMBERED', color: 'GREEN', number: 8 })
      .hand(1).is({ type: 'NUMBERED', color: 'GREEN', number: 4 })
      .build()
    const hand = applyActions(createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 1}), 
      play(0, undefined))
    it("returns true from hasEnded()", () => {
      expect(hasEnded(hand)).toBeTruthy()
    })
    it("returns the winner", () => {
      expect(winner(hand)).toEqual(0);
    })
    it("makes the player in turn undefined", () => {
      expect(hand.playerInTurn).toBeUndefined()
    })
    it("ceases play", () => {
      expect(canPlay(0, hand)).toBeFalsy()
      expect(canPlayAny(hand)).toBeFalsy()
    })
    it("gives error on attempted play", () => {
      expect(() => play(0, undefined, hand)).toThrow()
    })
    it("gives error on attempted draw", () => {
      expect(() => draw(hand)).toThrow()
    })
    it("gives error on attempting to say 'UNO!'", () => {
      expect(() => sayUno(1, hand)).toThrow()
    })
  })
})

describe("score", () => {
  const builder = shuffleBuilder({ players: 2, cardsPerPlayer: 1 })
    .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
    .hand(0).is({ type: 'NUMBERED', color: 'GREEN', number: 8 })
  it("is undefined before the last card is played", () => {
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b'], dealer: 1, shuffler, cardsPerPlayer: 1})
    expect(hasEnded(hand)).toBeFalsy()
    expect(score(hand)).toBeUndefined()
  })
  it("is defined after the last card is played", () => {
    const shuffler = builder.build()
    const hand = play(0, undefined, createHand({players: ['a', 'b'], dealer: 1, shuffler, cardsPerPlayer: 1}))
    expect(score(hand)).toBeDefined()
  })
  it("has the value of the card number if the opponent holds a numbered card", () => {
    for(let number = 0; number <= 9; number++) {
      builder.hand(1).is({type: 'NUMBERED', number})
      const shuffler = builder.build()
      const hand = play(0, undefined, createHand({players: ['a', 'b'], dealer: 1, shuffler, cardsPerPlayer: 1}))
      expect(score(hand)).toEqual(number)
    }
  })
  it("has the value 20 if the opponent holds a draw card", () => {
    builder.hand(1).is({type: 'DRAW'})
    const shuffler = builder.build()
    const hand = play(0, undefined, createHand({players: ['a', 'b'], dealer: 1, shuffler, cardsPerPlayer: 1}))
    expect(score(hand)).toEqual(20)
  })
  it("has the value 20 if the opponent holds a reverse card", () => {
    builder.hand(1).is({type: 'REVERSE'})
    const shuffler = builder.build()
    const hand = play(0, undefined, createHand({players: ['a', 'b'], dealer: 1, shuffler, cardsPerPlayer: 1}))
    expect(score(hand)).toEqual(20)
  })
  it("has the value 20 if the opponent holds a skip card", () => {
    builder.hand(1).is({type: 'SKIP'})
    const shuffler = builder.build()
    const hand = play(0, undefined, createHand({players: ['a', 'b'], dealer: 1, shuffler, cardsPerPlayer: 1}))
    expect(score(hand)).toEqual(20)
  })
  it("has the value 50 if the opponent holds a wild card", () => {
    builder.hand(1).is({type: 'WILD'})
    const shuffler = builder.build()
    const hand = play(0, undefined, createHand({players: ['a', 'b'], dealer: 1, shuffler, cardsPerPlayer: 1}))
    expect(score(hand)).toEqual(50)
  })
  it("has the value 50 if the opponent holds a wild draw card", () => {
    builder.hand(1).is({type: 'WILD DRAW'})
    const shuffler = builder.build()
    const hand = play(0, undefined, createHand({players: ['a', 'b'], dealer: 1, shuffler, cardsPerPlayer: 1}))
    expect(score(hand)).toEqual(50)
  })
  it("adds the cards if the opponent have more than one card", () => {
    builder.hand(0).is({color: 'BLUE', type: 'DRAW'})
    builder.hand(1).is({type: 'WILD DRAW'})
    builder.drawPile().is({number: 5}, {type: 'REVERSE'})
    const shuffler = builder.build()
    const hand = play(0, undefined, createHand({players: ['a', 'b'], dealer: 1, shuffler, cardsPerPlayer: 1}))
    expect(hand.hands[1].length).toEqual(3)
    expect(score(hand)).toEqual(75)
  })
  it("adds the cards of all opponents if there are more than 2 players", () => {
    const builder = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
      .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
      .hand(0).is({color: 'BLUE', type: 'DRAW'})
      .hand(1).is({type: 'WILD DRAW'})
      .hand(2).is({number: 7})
      .hand(3).is({number: 3})
      .drawPile().is({number: 5}, {type: 'REVERSE'})
    const shuffler = builder.build()
    const hand = play(0, undefined, createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 1}))
    expect(score(hand)).toEqual(85)
  })
})
