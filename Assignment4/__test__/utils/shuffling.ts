import { Card } from "../../src/model/deck"
import { Shuffler, standardShuffler } from "../../src/utils/random_utils"
import { CardPredicate, CardSpec, is } from "./predicates"
import * as R from 'ramda'

export const deterministicShuffle = (cards: Card[]): Shuffler<Card> => _ => cards

export function successiveShufflers(...shufflers: Shuffler<Card>[]): Shuffler<Card> {
  shufflers.reverse()
  let shuffler = shufflers.pop() ?? standardShuffler
  return (cards: readonly Card[]) => {
    let shuffled = shuffler(cards)
    shuffler = shufflers.pop() ?? shuffler
    return shuffled
  }  
}

export const noShuffle: Shuffler<Card> = cs => [...cs]


export function constrainedShuffler(...constraints: [number, CardPredicate][]): Shuffler<Card> {
  return (cards: readonly Card[]) => {
    const cs = [...cards]
    constraints.sort(([a, _], [b, __]) => a - b)
    standardShuffler(cs)
    let foundCards: Card[] = []
    for(let i = 0; i < constraints.length; i++) {
      let [_, predicate] = constraints[i]
      const foundIndex = cs.findIndex(predicate)
      if (foundIndex === -1) throw new Error('Unsatisfiable predicate')
      foundCards.push(cs[foundIndex])    
      cs.splice(foundIndex, 1)
    }  
    for(let i = 0; i < constraints.length; i++) {
      let [index] = constraints[i]
      cs.splice(index, 0, foundCards[i])
    }  
    return cs
  }  
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
      return constrain(specs.map(spec => R.complement(is(spec))))
    },
    build: () => constrainedShuffler(...constraints.entries())
  }

  return builder
}
