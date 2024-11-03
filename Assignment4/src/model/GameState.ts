import { Card } from "./Card";
import { Player } from "./Player";

export type GameState = {
  players: Player[];
  discardPile: Card[];
  drawPile: Card[];
  turnOrder: number[];
  scores: Record<string, number>;
  currentPlayerIndex: number;
}
