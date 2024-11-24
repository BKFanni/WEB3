import { Action, Hand } from "../../src/model/hand"
import * as R from 'ramda'

export const pipeActions = (...actions: Action[]) => (hand: Hand) => applyActions(hand, ...actions)

export const applyActions = (hand: Hand, ...actions: Action[]) => R.flow<Hand, Hand>(hand, actions)
