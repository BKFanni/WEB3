import { Card, Color, Type } from '../../src/model/deck'

export type CardPredicate = (_: Card | undefined) => boolean

export type CardSpec = {
  type?: Type | Type[]
  color?: Color | Color[]
  number?: number | number[]
}

export function is(spec: CardSpec): CardPredicate {
  function conforms<T>(spec: undefined | T | T[], p: T) {
    if (Array.isArray(spec)) return spec.includes(p)
    if (spec === undefined) return true  
    return spec === p
  }  

  return (c: Card | undefined) => {
    if (c === undefined) return false
    switch(c.type) {
      case 'NUMBERED':
        return conforms(spec.type, 'NUMBERED') && conforms(spec.color, c.color) && conforms(spec.number, c.number)
      case 'SKIP': case 'REVERSE': case 'DRAW':
        return conforms(spec.type, c.type) && conforms(spec.color, c.color) && spec.number === undefined
      default:
        return conforms(spec.type, c.type) && spec.color === undefined && spec.number === undefined
    }    
  }  
}  

export function not(pred: CardPredicate): CardPredicate {
  return c => !pred(c)
}
