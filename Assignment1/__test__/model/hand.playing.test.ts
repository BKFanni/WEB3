import { describe, it, test, expect, beforeEach, jest } from '@jest/globals'
import { createHand} from '../utils/test_adapter'
import { Hand } from '../../src/model/hand'
import { shorteningShuffler, shuffleBuilder, successiveShufflers } from '../utils/shuffling'
import { is } from '../utils/predicates'

describe("Playing a card", () => {
  it("throws on illegal plays", () => {
    const shuffler = shuffleBuilder()
      .discard()
        .is({type: 'NUMBERED', color: 'BLUE', number: 6})
      .hand(0)
        .is({type: 'NUMBERED', color: 'RED', number: 3})
      .build()
    const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
    expect(() => hand.play(0)).toThrow()
  })

  describe("Playing a numbered card", () => {
    let hand: Hand = undefined as any
    beforeEach(() => {
      const builder = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE', number: 6})
        .hand(0)
          .is({type: 'NUMBERED', color: 'BLUE', number: 3})
      hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler: builder.build()})
    })
    it("removes the card from the players hand", () => {
      hand.play(0)
      expect(hand.playerHand(0).length).toEqual(6)
    })
    it("places the card on the discard pile", () => {
      const card = hand.play(0)
      expect(hand.discardPile().top()).toEqual(card)
    })
    it("moves the action to the next hand", () => {
      expect(hand.playerInTurn()).toEqual(0)
      hand.play(0)
      expect(hand.playerInTurn()).toEqual(1)
    })
    it("changes color to the played color", () => {
      const shuffler = (shuffleBuilder()
        .discard()
          .is({ type: 'NUMBERED', color: 'BLUE', number: 6 })
        .hand(0)
          .is({ type: 'NUMBERED', color: 'RED', number: 6 })
        .hand(1)
          .is({ color: 'RED' }))
        .build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.play(0)
      expect(hand.canPlay(0)).toBeTruthy()
    })
  })

  describe("Playing a skip card", () => {
    it("skips the next player", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE', number: 6})
        .hand(0)
          .is({type: 'SKIP', color: 'BLUE'})
        .build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.playerInTurn()).toEqual(0)
      hand.play(0)
      expect(hand.playerInTurn()).toEqual(2)
    })
  })

  describe("Playing a reverse card", () => {
    let builder = shuffleBuilder()
    beforeEach(() => {
      builder = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE', number: 6})
        .hand(0)
          .is({type: 'REVERSE', color: 'BLUE'})
    })
    it("reverses the direction of play", () => {
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler: builder.build()})
      expect(hand.playerInTurn()).toEqual(0)
      hand.play(0)
      expect(hand.playerInTurn()).toEqual(3)
    })
    it("makes the reversing persistent", () => {
      builder.hand(3).is({type: 'NUMBERED', color: 'BLUE'})
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler: builder.build()})
      expect(hand.playerInTurn()).toEqual(0)
      hand.play(0)
      hand.play(0)
      expect(hand.playerInTurn()).toEqual(2)
    })
    it("reverses the reversing", () => {
      builder
        .hand(3)
          .is({type: 'NUMBERED', color: 'BLUE'})
        .hand(2)
          .is({type: 'REVERSE', color: 'BLUE'})
        const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler: builder.build()})
        expect(hand.playerInTurn()).toEqual(0)
      hand.play(0)
      hand.play(0)
      hand.play(0)
      expect(hand.playerInTurn()).toEqual(3)
    })
  })

  describe("Playing a draw card", () => {
    let hand: Hand = undefined as any
    beforeEach(() => {
      const builder = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE', number: 6})
        .hand(0)
          .is({type: 'DRAW', color: 'BLUE'})
      hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler: builder.build()})
    })
    it("skips the next player", () => {
      expect(hand.playerInTurn()).toEqual(0)
      hand.play(0)
      expect(hand.playerInTurn()).toEqual(2)
    })
    it("gives the next player 2 cards", () => {
      hand.play(0)
      expect(hand.playerHand(1).length).toEqual(9)
    })
    it("takes the 2 cards from the draw pile", () => {
      const pileSize = hand.drawPile().size
      hand.play(0)
      expect(hand.drawPile().size).toEqual(pileSize - 2)
    })
  })

  describe("Playing a wild card", () => {
    let builder = shuffleBuilder()
    beforeEach(() => {
      builder = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE', number: 6})
        .hand(0)
          .is({type: 'WILD'})
    })
    it("moves the action to the next hand", () => {
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler: builder.build()})
      expect(hand.playerInTurn()).toEqual(0)
      hand.play(0, 'RED')
      expect(hand.playerInTurn()).toEqual(1)
    })
    it("changes color to the chosen color", () => {
      builder.hand(1).is({color: 'RED'})
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler: builder.build()})
      hand.play(0, 'RED')
      expect(hand.canPlay(0)).toBeTruthy()
    })
  })

  describe("Playing a wild draw card", () => {
    let builder = shuffleBuilder()
    beforeEach(() => {
      builder = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE', number: 6})
        .hand(0)
          .is({type: 'WILD DRAW'})
        .repeat(6).isnt({color: 'BLUE'})
    })
    it("skips the next player", () => {
      const shuffler = builder.build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.playerInTurn()).toEqual(0)
      hand.play(0, 'RED')
      expect(hand.playerInTurn()).toEqual(2)
    })
    it("gives the next player 4 cards", () => {
      const shuffler = builder.build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.play(0, 'RED')
      expect(hand.playerHand(1).length).toEqual(11)
    })
    it("takes the 4 cards from the draw pile", () => {
      const shuffler = builder.build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      const pileSize = hand.drawPile().size
      hand.play(0, 'RED')
      expect(hand.drawPile().size).toEqual(pileSize - 4)
    })
    it("changes color to the chosen color", () => {
      builder.hand(2).is({color: 'RED'})
      const shuffler = builder.build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.play(0, 'RED')
      expect(hand.canPlay(0)).toBeTruthy()
    })
  })

  describe("Boundaries", () => {
    it("is illegal to play a non-existant card", () => {
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3}) 
      expect(() => hand.play(-1)).toThrow()
      expect(() => hand.play(7)).toThrow()
    })
    it("is illegal to name a color on a colored card", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE'})
        .hand(0)
          .is({color: 'BLUE'})
        .build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(() => hand.play(0, "YELLOW")).toThrow()
    })
    it("is illegal _not_ to name a color on a wild card", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE'})
        .hand(0)
          .is({type: 'WILD'})
        .build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(() => hand.play(0)).toThrow()
    })
    it("is illegal _not_ to name a color on a wild draw card", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE'})
        .hand(0)
          .is({type: 'WILD DRAW'})
          .repeat(6).isnt({color: 'BLUE'})
        .build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(() => hand.play(0)).toThrow()
    })
  })
})

describe("Drawing a card", () => {
  describe("can play any", () => {
    it("returns true if the player has a playable card", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE'})
        .hand(0)
          .is({color: 'BLUE'})
        .build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlayAny()).toBeTruthy()
    })
    it("returns false if the player has a playable card", () => {
      const shuffler = shuffleBuilder()
        .discard()
          .is({type: 'NUMBERED', color: 'BLUE', number: 0})
        .hand(0)
          .is({type: 'NUMBERED', color: 'RED', number: 1})
          .is({type: 'NUMBERED', color: 'YELLOW', number: 2})
          .is({type: 'NUMBERED', color: 'RED', number: 3})
          .is({type: 'NUMBERED', color: 'GREEN', number: 4})
          .is({type: 'SKIP', color: 'RED'})
          .is({type: 'REVERSE', color: 'GREEN'})
          .is({type: 'DRAW', color: 'YELLOW'})
        .build()
      const hand: Hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      expect(hand.canPlayAny()).toBeFalsy()
    })
  })

  describe("draw", () => {
    let builder = shuffleBuilder()
    beforeEach(() => {
      builder = shuffleBuilder()
      .discard()
        .is({type: 'NUMBERED', color: 'BLUE', number: 0})
      .hand(0)
        .is({type: 'NUMBERED', color: 'RED', number: 1})
        .is({type: 'NUMBERED', color: 'YELLOW', number: 2})
        .is({type: 'NUMBERED', color: 'RED', number: 3})
        .is({type: 'NUMBERED', color: 'GREEN', number: 4})
        .is({type: 'SKIP', color: 'RED'})
        .is({type: 'REVERSE', color: 'GREEN'})
        .is({type: 'DRAW', color: 'YELLOW'})    
    })
    it("adds the drawn card to the hand", () => {
      const shuffler = builder.build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.draw()
      expect(hand.playerHand(0).length).toEqual(8)
    })
    it("adds the top of the draw pile to the end of the hand", () => {
      const shuffler = builder
        .drawPile().is({type: 'DRAW', color: 'GREEN'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.draw()
      expect(
        is({type: 'DRAW', color: 'GREEN'})(hand.playerHand(0).at(7))
      ).toBeTruthy()
    })
    it("moves to the next player if the card is unplayable", () => {
      const shuffler = builder
        .drawPile().is({type: 'DRAW', color: 'GREEN'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.draw()
      expect(hand.playerInTurn()).toBe(1)
    })
    it("doesn't move to the next player if the card is unplayable", () => {
      const shuffler = builder
        .drawPile().is({type: 'DRAW', color: 'BLUE'})
        .build()
      const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler})
      hand.draw()
      expect(hand.playerInTurn()).toBe(0)
    })
  })

  describe("drawing the last card", () => {
    describe("succesive play", () => {
      const builder = shuffleBuilder({players: 4, cardsPerPlayer: 1})
        .discard().is({type: 'NUMBERED', color: 'BLUE', number: 8})
        .drawPile()
          .is({type: 'SKIP', color: 'BLUE'})
          .is({type: 'NUMBERED', color: 'YELLOW', number: 3})
        .hand(0).is({type: 'NUMBERED', color: 'GREEN', number: 4})
        .hand(1).is({type: 'WILD'})
        .hand(2).is({type: 'NUMBERED', color: 'GREEN', number: 8})
        .hand(3).is({type: 'NUMBERED', color: 'GREEN', number: 0})
      let mockShuffler = jest.fn()
      let hand: Hand = undefined as any
      beforeEach(() => {
        // Leave the deck with only the above 7 cards:
        const shortener = shorteningShuffler(7, builder.build()) 
        mockShuffler = jest.fn()
        const shuffler = successiveShufflers(shortener, mockShuffler)
        hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 1})
      })
      it("begins with player 0 drawing a playable card", () => {
        hand.draw()
        expect(hand.playerHand(0).length).toEqual(2)
        expect(hand.playerInTurn()).toEqual(0)
      })
      it("proceeds with player 0 playing the drawn card, skipping player 1", () => {
        hand.draw()
        hand.play(1)
        expect(hand.playerHand(0).length).toEqual(1)
        expect(hand.playerInTurn()).toEqual(2)
      })
      it("proceeds with player drawing an unplayable card", () => {
        hand.draw()
        hand.play(1)
        hand.draw()
        expect(hand.playerHand(2).length).toEqual(2)
        expect(hand.playerInTurn()).toEqual(3)
      })
      it("proceeds with shuffling to create a new draw pile", () => {
        hand.draw()
        hand.play(1)
        hand.draw()
        expect(mockShuffler).toHaveBeenCalled() // TODO: Times 1
      })
      it("retains the top card of the discard pile", () => {
        hand.draw()
        hand.play(1)
        const top = hand.discardPile().top()
        hand.draw()
        expect(hand.discardPile().top()).toEqual(top)
      })
      it("leaves only the top card in the discard pile", () => {
        hand.draw()
        hand.play(1)
        hand.draw()
        expect(hand.discardPile().size).toEqual(1)
      })
      it("adds cards in the draw pile", () => {
        hand.draw()
        hand.play(1)
        hand.draw()
        expect(hand.drawPile().size).toEqual(1)
      })
      it("leaves the cards removed from the discard pile in the draw pile", () => {
        const card = hand.discardPile().top()
        hand.draw()
        hand.play(1)
        hand.draw()
        hand.draw()
        expect(hand.playerHand(3).at(1)).toEqual(card)
      })
    })
  })

  describe("when drawing because of a card", () => {
    const builder = shuffleBuilder({players: 4, cardsPerPlayer: 1})
      .discard().is({type: 'NUMBERED', color: 'BLUE', number: 8})
      .drawPile()
        .is({type: 'NUMBERED', color: 'BLUE'})
        .is({type: 'DRAW', color: 'BLUE'})
      .hand(0).is({type: 'SKIP', color: 'GREEN'})
      .hand(1).is({type: 'REVERSE', color: 'YELLOW'})
    const shortener = shorteningShuffler(8, builder.build()) 
    const mockShuffler = jest.fn()
    const shuffler = successiveShufflers(shortener, mockShuffler)
    const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.draw()
    hand.play(1)
    hand.draw()
    expect(hand.playerInTurn()).toBe(1)
    expect(hand.playerHand(1).at(1)?.type).toEqual('DRAW')
    expect(hand.drawPile().size).toEqual(1)
    hand.play(1)
    expect(hand.playerHand(2).length).toEqual(3)
    expect(hand.discardPile().size).toEqual(1)
    expect(hand.drawPile().size).toEqual(1)
  })
})

describe("special 2-player rules", () => {
  test("playing a reverse card works as a skip card", () => {
    const shuffler = shuffleBuilder({players: 2, cardsPerPlayer: 7})
      .discard().is({type:'NUMBERED', color: 'BLUE'})
      .hand(0).is({type: 'REVERSE', color: 'BLUE'})
      .build()
    const hand = createHand({players: ['a', 'b'], dealer: 1, shuffler})
    expect(hand.playerInTurn()).toEqual(0)
    hand.play(0)
    expect(hand.playerInTurn()).toEqual(0)
  })
})