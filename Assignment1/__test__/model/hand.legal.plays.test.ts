import { describe, it, expect, beforeEach } from '@jest/globals'
import { createHand} from '../utils/test_adapter'
import { Hand } from '../../src/model/hand'
import { shuffleBuilder } from '../utils/shuffling'

describe("Legal plays", () => {
  describe("Legal plays on a numbered card", () => {
    let builder = shuffleBuilder()
    beforeEach(() => {
      builder = shuffleBuilder().discard().is({type: 'NUMBERED', color: 'BLUE', number: 6})
    })
    it("is legal to play a numbered card in the same color as the top card", () => {
      const shuffler = builder.hand(0).is({type: 'NUMBERED', color: 'BLUE', number: 3}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a card with different number and color than the top card", () => {
      const shuffler = builder.hand(0).is({type: 'NUMBERED', color: 'RED', number: 3}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a card with the same number as the top card", () => {
      const shuffler = builder.hand(0).is({type: 'NUMBERED', color: 'RED', number: 6}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is legal to play a reverse card in the same color as the top card", () => {
      const shuffler = builder.hand(0).is({type: 'REVERSE', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a reverse card in a different color as the top card", () => {
      const shuffler = builder.hand(0).is({type: 'REVERSE', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a skip card in the same color as the top card", () => {
      const shuffler = builder.hand(0).is({type: 'SKIP', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a skip card in a different color as the top card", () => {
      const shuffler = builder.hand(0).is({type: 'SKIP', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a draw card in the same color as the top card", () => {
      const shuffler = builder.hand(0).is({type: 'DRAW', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a draw card in a different color as the top card", () => {
      const shuffler = builder.hand(0).is({type: 'DRAW', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a wild card on a numbered top card", () => {
      const shuffler = builder.hand(0).is({type: 'WILD'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
  })

  describe("legal plays on a reverse card", () => {
    let builder = shuffleBuilder()
    beforeEach(() => {
      builder = shuffleBuilder().discard().is({type: 'REVERSE', color: 'BLUE'})
    })
    it("is legal to play a card in the same color as the top card", () => {
      const shuffler = builder.hand(2).is({type: 'NUMBERED', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a non-reverse card with different color than the top card", () => {
      const shuffler = builder.hand(2).is({type: 'NUMBERED', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a reverse card", () => {
      const shuffler = builder.hand(2).is({type: 'REVERSE', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is legal to play a skip card in the same color as the top card", () => {
      const shuffler = builder.hand(2).is({type: 'SKIP', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a skip card in a different color as the top card", () => {
      const shuffler = builder.hand(2).is({type: 'SKIP', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a draw card in the same color as the top card", () => {
      const shuffler = builder.hand(2).is({type: 'DRAW', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a draw card in a different color as the top card", () => {
      const shuffler = builder.hand(2).is({type: 'DRAW', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a wild card on a reverse top card", () => {
      const shuffler = builder.hand(2).is({type: 'WILD'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
  })

  describe("legal plays on a skip card", () => {
    let builder = shuffleBuilder()
    beforeEach(() => {
      builder = shuffleBuilder().discard().is({type: 'SKIP', color: 'BLUE'})
    })
    it("is legal to play a card in the same color as the top card", () => {
      const shuffler = builder.hand(1).is({type: 'NUMBERED', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a non-skip card with different color than the top card", () => {
      const shuffler = builder.hand(1).is({type: 'NUMBERED', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a skip card", () => {
      const shuffler = builder.hand(1).is({type: 'SKIP', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is legal to play a reverse card in the same color as the top card", () => {
      const shuffler = builder.hand(1).is({type: 'REVERSE', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a reverse card in a different color as the top card", () => {
      const shuffler = builder.hand(1).is({type: 'REVERSE', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a draw card in the same color as the top card", () => {
      const shuffler = builder.hand(1).is({type: 'DRAW', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a draw card in a different color as the top card", () => {
      const shuffler = builder.hand(1).is({type: 'DRAW', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a wild card on a skip top card", () => {
      const shuffler = builder.hand(1).is({type: 'WILD'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
  })

  describe("legal plays on a draw card", () => {
    let builder = shuffleBuilder()
    beforeEach(() => {
      builder = shuffleBuilder().discard().is({type: 'DRAW', color: 'BLUE'})
    })
    it("is legal to play a card in the same color as the top card", () => {
      const shuffler = builder.hand(1).is({type: 'NUMBERED', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a non-skip card with different color than the top card", () => {
      const shuffler = builder.hand(1).is({type: 'NUMBERED', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a draw card", () => {
      const shuffler = builder.hand(1).is({type: 'DRAW', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is legal to play a reverse card in the same color as the top card", () => {
      const shuffler = builder.hand(1).is({type: 'REVERSE', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a reverse card in a different color as the top card", () => {
      const shuffler = builder.hand(1).is({type: 'REVERSE', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a skip card in the same color as the top card", () => {
      const shuffler = builder.hand(1).is({type: 'SKIP', color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is not legal to play a skip card in a different color as the top card", () => {
      const shuffler = builder.hand(1).is({type: 'SKIP', color: 'RED'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a wild card on a skip top card", () => {
      const shuffler = builder.hand(1).is({type: 'WILD'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
  })

  describe("legal plays with a wild draw 4 card", () => {
    it("is illegal to play a wild draw 4 card if hand contains a card with matching color", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'GREEN'})
        .hand(0

        ).is({type: 'WILD DRAW'}, {color: 'GREEN'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a wild draw 4 card if hand doesn't contain another playable card", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'GREEN', number: 2})
        .hand(0)
          .is({type: 'WILD DRAW'})
          .is({type: 'NUMBERED', color: 'BLUE', number: 0})
          .is({type: 'NUMBERED', color: 'RED', number: 3})
          .is({type: 'NUMBERED', color: 'YELLOW', number: 7})
          .is({type: 'DRAW', color: 'BLUE'})
          .is({type: 'REVERSE', color: 'RED'})
          .is({type: 'SKIP', color: 'YELLOW'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is legal to play a wild draw 4 card even if hand contains a card with the right number", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'GREEN', number: 3})
        .hand(0)
          .is({type: 'WILD DRAW'})
          .is({type: 'NUMBERED', color: 'RED', number: 3})
          .repeat(5).isnt({color: 'GREEN'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is legal to play a wild draw 4 card even if hand contains a eligible draw card", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'DRAW', color: 'GREEN'})
        .hand(1)
          .is({type: 'WILD DRAW'})
          .is({type: 'DRAW', color: 'RED'})
          .repeat(5).isnt({color: 'GREEN'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is legal to play a wild draw 4 card if hand contains a eligible skip card", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'SKIP', color: 'GREEN'})
        .hand(1)
          .is({type: 'WILD DRAW'})
          .is({type: 'SKIP', color: 'RED'})
          .repeat(5).isnt({color: 'GREEN'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is legal to play a wild draw 4 card if hand contains a eligible reverse card", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'REVERSE', color: 'GREEN'})
        .hand(2)
          .is({type: 'WILD DRAW'})
          .is({type: 'REVERSE', color: 'RED'})
          .repeat(5).isnt({color: 'GREEN'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is legal to play a wild draw 4 card if hand contains a wild card", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'GREEN'})
        .hand(0)
          .is({type: 'WILD DRAW'})
          .is({type: 'WILD'})
          .repeat(5).isnt({color: 'GREEN'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlay(0)).toBeTruthy()
    })
  })

  describe("legal plays on a wild card", () => {
    let builder = shuffleBuilder()
    beforeEach(() => {
      builder = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED'})
        .hand(0)
          .is({type: 'WILD'})
    })
    it("is legal to play a hand of the chosen color after a wild card", () => {
      const shuffler = builder.hand(1).is({color: 'BLUE'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.play(0, 'BLUE')
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is illegal to play a hand of another color but the chosen after a wild card", () => {
      const shuffler = builder.hand(1).is({color: ['GREEN', 'RED', 'YELLOW']}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.play(0, 'BLUE')
      expect(hand.canPlay(0)).toBeFalsy()
    })
    it("is legal to play a wild card after a wild card", () => {
      const shuffler = builder.hand(1).is({type: 'WILD'}).build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.play(0, 'BLUE')
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is legal to play a wild draw 4 card if hand doesn't contain the selected color", () => {
      const shuffler = builder
        .hand(1)
          .is({type: 'WILD DRAW'})
          .repeat(6).isnt({color: 'GREEN'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.play(0, 'GREEN')
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("is illegal to play a wild draw 4 card if hand contains the selected color", () => {
      const shuffler = builder
        .hand(1)
          .is({type: 'WILD DRAW'})
          .is({color: 'GREEN'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.play(0, 'GREEN')
      expect(hand.canPlay(0)).toBeFalsy()
    })
  })

  describe("boundary conditions", () => {
    it("is illegal to play a card with negative index", () => {
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3})
      expect(hand.canPlay(-1)).toBeFalsy()
    })
    it("is illegal to play a card with index beyond the maximum", () => {
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3})
      expect(hand.canPlay(7)).toBeFalsy()
    })
  })
})
