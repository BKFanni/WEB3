import { describe, it, expect } from '@jest/globals'
import { createInitialDeck } from '../utils/test_adapter'
import * as R from 'ramda'
import * as deck from '../../src/model/deck'

describe("Initial deck", () => {
  const initialDeck = createInitialDeck()
  it("contains 19 numbered blue cards", () => {
    expect(R.count(R.whereEq({type: 'NUMBERED', color: 'BLUE'}), initialDeck)).toEqual(19)
  })
  it("contains 19 numbered green cards", () => {
    expect(R.count(R.whereEq({type: 'NUMBERED', color: 'GREEN'}), initialDeck)).toEqual(19)
  })
  it("contains 19 numbered red cards", () => {
    expect(R.count(R.whereEq({type: 'NUMBERED', color: 'RED'}), initialDeck)).toEqual(19)
  })
  it("contains 19 numbered yellow cards", () => {
    expect(R.count(R.whereEq({type: 'NUMBERED', color: 'YELLOW'}), initialDeck)).toEqual(19)
  })
  it("only contains numbered card with numbers between 0 and 9", () => {
    const numberedDeck = R.filter(R.whereEq({type: 'NUMBERED'}), initialDeck)
    for(let card of numberedDeck) {
      const n = (card as {number: number}).number
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(10)
    }
  })
  it("contains numbered cards of every legal number and color", () => {
    for(let color of deck.colors) {
      expect(R.count(R.whereEq({number: 0, color}), initialDeck)).toEqual(1)
      for(let number of R.range(1, 10)) {
        expect(R.count(R.whereEq({number, color}), initialDeck)).toEqual(2)
      }
    }
  })
  it("contains 8 skip cards", () => {
    expect(R.count(R.whereEq({type: 'SKIP'}), initialDeck)).toEqual(8)
  })
  it("contains 2 skip cards of each color", () => {
    for(let color of deck.colors) {
      expect(R.count(R.whereEq({type: 'SKIP', color}), initialDeck)).toEqual(2)
    }
  })
  it("contains 8 reverse cards", () => {
    expect(R.count(R.whereEq({type: 'REVERSE'}), initialDeck)).toEqual(8)
  })
  it("contains 2 reverse cards of each color", () => {
    for(let color of deck.colors) {
      expect(R.count(R.whereEq({type: 'REVERSE', color}), initialDeck)).toEqual(2)
    }
  })
  it("contains 8 draw cards", () => {
    expect(R.count(R.whereEq({type: 'DRAW'}), initialDeck)).toEqual(8)
  })
  it("contains 2 draw cards of each color", () => {
    for(let color of deck.colors) {
      expect(R.count(R.whereEq({type:'DRAW',color}), initialDeck)).toEqual(2)
    }
  })
  it("contains 4 wild cards", () => {
    expect(R.count(R.whereEq({type:'WILD'}), initialDeck)).toEqual(4)
  })
  it("contains 4 wild draw cards", () => {
    expect(R.count(R.whereEq({ type:'WILD DRAW' }), initialDeck)).toEqual(4)
  })
  // Blank cards skipped, since they have no gameplay
  it("contains 108 cards", () => {
    expect(initialDeck.length).toEqual(108)
  })
})
