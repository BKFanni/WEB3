import { describe, it, test, expect, beforeEach } from '@jest/globals'
import { createHand} from '../utils/test_adapter'
import { Hand } from '../../src/model/hand'
import { shorteningShuffler, shuffleBuilder, successiveShufflers } from '../utils/shuffling'

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
  let hand: Hand = undefined as any
  describe("single UNO scenario", () => {
    beforeEach(() => {
      const shuffler = builder.build()
      hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 2})
      hand.draw()
      hand.play(hand.playerHand(0).length - 1)
      hand.draw()
      hand.draw()
      hand.draw()
    })
    test("set up is as expected", () => {
      expect(hand.playerHand(0).length).toEqual(2)
      expect(hand.playerHand(1).length).toEqual(3)
      expect(hand.playerHand(2).length).toEqual(3)
      expect(hand.playerHand(3).length).toEqual(3)
      expect(hand.playerInTurn()).toEqual(0)
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("fails if the player hasn't played penultimate card", () => {
      expect(hand.catchUnoFailure({accuser: 1, accused: 0})).toBeFalsy()
    })
    it("succeeds if the player has one card and hasn't said 'UNO!'", () => {
      hand.play(0)
      expect(hand.catchUnoFailure({accuser: 1, accused: 0})).toBeTruthy()
    })
    it("adds 4 cards to the hand of the accused player if successful", () => {
      hand.play(0)
      hand.catchUnoFailure({accuser: 1, accused: 0})
      expect(hand.playerHand(0).length).toBe(5)
    })
    it("takes the added cards from the draw pile", () => {
      hand.play(0)
      const drawPileSize = hand.drawPile().size
      hand.catchUnoFailure({accuser: 1, accused: 0})
      expect(hand.drawPile().size).toBe(drawPileSize - 4)
    })
    it("succeeds irrespective of the accuser", () => {
      hand.play(0)
      expect(hand.catchUnoFailure({accuser: 2, accused: 0})).toBeTruthy()
    })
    it("fails if the next player has already played", () => {
      hand.play(0)
      hand.play(0)
      expect(hand.catchUnoFailure({accuser: 3, accused: 0})).toBeFalsy()
    })
    it("fails if the next player has drawn a card", () => {
      hand.play(1)
      hand.draw()
      expect(hand.catchUnoFailure({accuser: 3, accused: 0})).toBeFalsy()
    })
    it("cannot be applied twice", () => {
      hand.play(0)
      expect(hand.catchUnoFailure({accuser: 2, accused: 0})).toBeTruthy()
      expect(hand.catchUnoFailure({accuser: 2, accused: 0})).toBeFalsy()
    })
    it("can succeed after first accusing the wrong player", () => {
      hand.play(0)
      expect(hand.catchUnoFailure({accuser: 2, accused: 1})).toBeFalsy()
      expect(hand.catchUnoFailure({accuser: 2, accused: 0})).toBeTruthy()
    })
    it("fails if the accused has said 'UNO!' before playing", () => {
      hand.sayUno(0)
      hand.play(0)
      expect(hand.catchUnoFailure({accuser: 2, accused: 0})).toBeFalsy()
    })
    it("fails if the accused has said 'UNO!' after playing but before the accusation", () => {
      hand.play(0)
      hand.sayUno(0)
      expect(hand.catchUnoFailure({accuser: 2, accused: 0})).toBeFalsy()
    })
    it("still succeeds if the player has said 'UNO!' before another player draws", () => {
      const shuffler = builder.build()
      hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 2})
      hand.draw()
      hand.play(hand.playerHand(0).length - 1)
      hand.draw()
      hand.draw()
      hand.sayUno(0) // player 3 is in turn
      hand.draw()
      hand.play(0)
      expect(hand.catchUnoFailure({accuser: 1, accused: 0})).toBeTruthy()    
    })

    
  })

  describe("emptying the draw pile", () => {
    beforeEach(() => {
      builder.hand(3).is({type: 'NUMBERED', color: 'BLUE', number: 4}, {type: 'REVERSE', color: 'RED'})
      const shuffler = successiveShufflers(shorteningShuffler(14, builder.build()), () => {})
      hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 2})
      hand.draw()
      hand.play(hand.playerHand(0).length - 1)
      hand.draw()
      hand.draw()
      hand.sayUno(3)
      hand.play(0)
    })
    test("set up is as expected", () => {
      expect(hand.playerHand(0).length).toEqual(2)
      expect(hand.playerHand(1).length).toEqual(3)
      expect(hand.playerHand(2).length).toEqual(3)
      expect(hand.playerHand(3).length).toEqual(1)
      expect(hand.playerInTurn()).toEqual(0)
      expect(hand.canPlay(0)).toBeTruthy()
      expect(hand.drawPile().size).toEqual(2)
      expect(hand.discardPile().size).toEqual(3)
    })
    test("adding 4 cards to the hand shuffles the draw pile if necessary", () => {
      hand.play(0)
      expect(hand.drawPile().size).toEqual(2)
      expect(hand.discardPile().size).toEqual(4)
      hand.catchUnoFailure({accuser: 1, accused: 0})
      expect(hand.playerHand(0).length).toBe(5)
      expect(hand.drawPile().size).toEqual(1)
      expect(hand.discardPile().size).toEqual(1)
    })
  })

  describe("Multi UNO scenario", () => {
    beforeEach(() => {
      builder.hand(3).is({type: 'NUMBERED', color: 'BLUE', number: 4}, {type: 'REVERSE', color: 'RED'})
      const shuffler = builder.build()
      hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 2})
      hand.draw()
      hand.play(hand.playerHand(0).length - 1)
      hand.draw()
      hand.draw()
    })
    test("set up is as expected", () => {
      expect(hand.playerHand(0).length).toEqual(2)
      expect(hand.playerHand(1).length).toEqual(3)
      expect(hand.playerHand(2).length).toEqual(3)
      expect(hand.playerHand(3).length).toEqual(2)
      expect(hand.playerInTurn()).toEqual(3)
      expect(hand.canPlay(0)).toBeTruthy()
      hand.play(0)
      expect(hand.canPlay(0)).toBeTruthy()
    })
    it("still succeeds if the player has said 'UNO!' before another player plays", () => {
      hand.sayUno(0)
      hand.sayUno(3)
      hand.play(0)
      hand.play(0)
      expect(hand.catchUnoFailure({accuser: 1, accused: 0})).toBeTruthy()    
    })
    it("still fails even if another player says 'UNO!' after", () => {
      hand.play(0)
      hand.sayUno(0)
      hand.sayUno(3)
      hand.play(0)
      expect(hand.catchUnoFailure({accuser: 1, accused: 0})).toBeFalsy()    
    })
    it("still fails even if another player has already said 'UNO!'", () => {
      hand.play(0)
      hand.sayUno(0)
      hand.sayUno(3)
      expect(hand.catchUnoFailure({accuser: 1, accused: 3})).toBeFalsy()    
    })
  })

  describe("boundaries", () => {
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 2})
    test("accused cannot be negative", () => {
      expect(() => hand.catchUnoFailure({accused: -1, accuser: 0})).toThrow()
    })
    test("accused cannot be beyond the player count", () => {
      expect(() => hand.catchUnoFailure({accused: 4, accuser: 0})).toThrow()
    })
    test("the player saying 'UNO!' cannot be negative", () => {
      expect(() => hand.sayUno(-1)).toThrow()
    })
    test("the player saying 'UNO!' cannot be beyond the player count", () => {
      expect(() => hand.sayUno(4)).toThrow()
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
      expect(hand.hasEnded()).toBeFalsy()
    })
    it("doesn't return a winner", () => {
      expect(hand.winner()).toBeUndefined();
    })
  })

  describe("playing the last card", () => {
    const shuffler = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
      .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
      .hand(0).is({ type: 'NUMBERED', color: 'GREEN', number: 8 })
      .hand(1).is({ type: 'NUMBERED', color: 'GREEN', number: 4 })
      .build()
    const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.play(0)
    it("returns true from hasEnded()", () => {
      expect(hand.hasEnded()).toBeTruthy()
    })
    it("returns the winner", () => {
      expect(hand.winner()).toEqual(0);
    })
    it("makes the player in turn undefined", () => {
      expect(hand.playerInTurn()).toBeUndefined()
    })
    it("ceases play", () => {
      expect(hand.canPlay(0)).toBeFalsy()
      expect(hand.canPlayAny()).toBeFalsy()
    })
    it("gives error on attempted play", () => {
      expect(() => hand.play(0)).toThrow()
    })
    it("gives error on attempted draw", () => {
      expect(() => hand.draw()).toThrow()
    })
    it("gives error on attempting to say 'UNO!'", () => {
      expect(() => hand.sayUno(1)).toThrow()
    })
  })
})

describe("score", () => {
  const builder = shuffleBuilder({ players: 2, cardsPerPlayer: 1 })
    .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
    .hand(0).is({ type: 'NUMBERED', color: 'GREEN', number: 8 })
  it("is undefined before the last card is played", () => {
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b'], dealer: 3, shuffler, cardsPerPlayer: 1})
    expect(hand.score()).toBeUndefined()
  })
  it("is defined after the last card is played", () => {
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.play(0)
    expect(hand.score()).toBeDefined()
  })
  it("has the value of the card number if the opponent holds a numbered card", () => {
    for(let number = 0; number <= 9; number++) {
      builder.hand(1).is({type: 'NUMBERED', number})
      const shuffler = builder.build()
      const hand = createHand({players: ['a', 'b'], dealer: 3, shuffler, cardsPerPlayer: 1})
      hand.play(0)
      expect(hand.score()).toEqual(number)
    }
  })
  it("has the value 20 if the opponent holds a draw card", () => {
    builder.hand(1).is({type: 'DRAW'})
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.play(0)
    expect(hand.score()).toEqual(20)
  })
  it("has the value 20 if the opponent holds a reverse card", () => {
    builder.hand(1).is({type: 'REVERSE'})
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.play(0)
    expect(hand.score()).toEqual(20)
  })
  it("has the value 20 if the opponent holds a skip card", () => {
    builder.hand(1).is({type: 'SKIP'})
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.play(0)
    expect(hand.score()).toEqual(20)
  })
  it("has the value 50 if the opponent holds a wild card", () => {
    builder.hand(1).is({type: 'WILD'})
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.play(0)
    expect(hand.score()).toEqual(50)
  })
  it("has the value 50 if the opponent holds a wild draw card", () => {
    builder.hand(1).is({type: 'WILD DRAW'})
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.play(0)
    expect(hand.score()).toEqual(50)
  })
  it("adds the cards if the opponent have more than one card", () => {
    builder.hand(0).is({color: 'BLUE', type: 'DRAW'})
    builder.hand(1).is({type: 'WILD DRAW'})
    builder.drawPile().is({number: 5}, {type: 'REVERSE'})
    const shuffler = builder.build()
    const hand = createHand({players: ['a', 'b'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.play(0)
    expect(hand.playerHand(1).length).toEqual(3)
    expect(hand.score()).toEqual(75)
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
    const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.play(0)
    expect(hand.playerHand(1).length).toEqual(3)
    expect(hand.score()).toEqual(85)
  })
})

describe("callback", () => {
  const builder = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
    .discard().is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
    .drawPile().is({number: 8})
    .hand(0).is({color: 'GREEN', type: 'DRAW'})
    .hand(1).is({type: 'WILD DRAW'})
    .hand(2).is({number: 7})
    .hand(3).is({number: 3})
  const shuffler = builder.build()
  test("callback gets called at the end of the hand", () => {
    const events: any[] = []
    const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.onEnd(e => events.push(e))
    hand.draw()
    hand.play(1)
    hand.play(0, 'YELLOW')
    expect(events).toEqual([{winner: 1}])
  })
  test("all callbacks get called at the end of the hand", () => {
    const events: any[] = []
    const hand = createHand({players: ['a', 'b', 'c', 'd'], dealer: 3, shuffler, cardsPerPlayer: 1})
    hand.onEnd(e => events.push(e))
    hand.onEnd(e => events.push(e))
    hand.draw()
    hand.play(1)
    hand.play(0, 'YELLOW')
    expect(events).toEqual([{winner: 1}, {winner: 1}])
  })
})