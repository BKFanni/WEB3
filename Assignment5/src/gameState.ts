import { Card } from "./Card";
import { Player } from "./Player";

export type GameState = {
  players: Player[];
  discardPile: Card[];
  drawPile: Card[];
  turnOrder: number[];
  turnDirection: number; // 1 = forward, -1 backward
  scores: Record<string, number>;
  currentPlayerIndex: number;
}
