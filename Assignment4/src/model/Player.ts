import { Card } from "./Card";

export type Player = {
  name: string;
  hand: Card[];
  calledUno: boolean;
}
