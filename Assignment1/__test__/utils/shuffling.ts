import { Card } from "../../src/model/deck"
import { Hand } from "../../src/model/hand"
import { Shuffler, standardShuffler } from "../../src/utils/random_utils"
import { CardPredicate, CardSpec, is, not } from "./predicates"
import { HandProps, createHand, createInitialDeck } from "./test_adapter"

export function constrainedShuffler(...constraints: [number, CardPredicate][]): Shuffler<Card> {
  return (cards: Card[]) => {
    constraints.sort(([a, _], [b, __]) => a - b)
    standardShuffler(cards)
    let foundCards: Card[] = []
    for(let i = 0; i < constraints.length; i++) {
      let [_, predicate] = constraints[i]
      const foundIndex = cards.findIndex(predicate)
      if (foundIndex === -1) throw new Error('Unsatisfiable predicate')
      foundCards.push(cards[foundIndex])    
      cards.splice(foundIndex, 1)
    }  
    for(let i = 0; i < constraints.length; i++) {
      let [index] = constraints[i]
      cards.splice(index, 0, foundCards[i])
    }  
  }  
}

export function memoizingShuffler(shuffler: Shuffler<Card>): {readonly shuffler: Shuffler<Card>, readonly memo: Readonly<Card[]>} {
  let memo: Card[] = []
  function shuffle(cards: Card[]): void {
    shuffler(cards)
    memo = [...cards]
  }
  return {shuffler: shuffle, get memo() {return memo}}
}

export function successiveShufflers(...shufflers: Shuffler<Card>[]): Shuffler<Card> {
  let index = 0
  let shuffler = shufflers[index]
  return (cards: Card[]) => {
    shuffler(cards)
    if (index < shufflers.length - 1) index++
    shuffler = shufflers[index]
  }  
}

export function shorteningShuffler(size: number, shuffler: Shuffler<Card>): Shuffler<Card> {
  function shorteningShuffler(cards: Card[]) {
    shuffler(cards)
    cards.splice(size)
  }
  return shorteningShuffler
}

export function createHandWithShuffledCards(props: Partial<HandProps>): [Hand, Readonly<Card[]>] {
  const shuffler = props.shuffler ?? standardShuffler
  let shuffledCards: Card[] = []
  let memoShuffler = memoizingShuffler(shuffler)
  const hand = createHand({
    players: props.players ?? ['a', 'b', 'c', 'd'], 
    dealer: props.dealer ?? 1, 
    shuffler: memoShuffler.shuffler})
  return [hand, memoShuffler.memo]
}

export type ShuffleBuilder = {
  discard(): ShuffleBuilder
  drawPile(): ShuffleBuilder
  hand(player: number): ShuffleBuilder
  top(): ShuffleBuilder
  repeat(n: number): ShuffleBuilder
  is(...spec: CardSpec[]): ShuffleBuilder
  isnt(...spec: CardSpec[]): ShuffleBuilder
  build(): Shuffler<Card>
}

export function shuffleBuilder(
    {players, cardsPerPlayer: cardsInHand}: {players: number; cardsPerPlayer: number} = {players: 4, cardsPerPlayer: 7}
  ): ShuffleBuilder {
  const constraints: Map<number, CardPredicate> = new Map()
  const topOfDiscardPile = players * cardsInHand
  let currentIndex = 0
  let repetition = 1

  function constrain(preds: CardPredicate[]): ShuffleBuilder {
    for(let i = 0; i < repetition; i++) {
      for(let pred of preds) {
        constraints.set(currentIndex++, pred)
      }
    }
    repetition = 1
    return builder
  }

  const builder = {
    discard() {
      currentIndex = topOfDiscardPile
      repetition = 1
      return builder
    },
    drawPile() {
      currentIndex = topOfDiscardPile + 1
      repetition = 1
      return builder
    },
    hand(player: number) {
      currentIndex = player * cardsInHand
      repetition = 1
      return builder
    },
    top() {
      currentIndex = 0
      repetition = 1
      return builder
    },
    repeat(n: number) {
        repetition = n
        return builder
    },
    is(...specs: CardSpec[]) {
      return constrain(specs.map(is))
    },
    isnt(...specs: CardSpec[]) {
      return constrain(specs.map(spec => not(is(spec))))
    },
    build: () => constrainedShuffler(...constraints.entries())
  }

  return builder
}