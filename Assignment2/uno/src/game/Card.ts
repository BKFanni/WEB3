export enum CardColor {
    Red,
    Green,
    Blue,
    Yellow
}

export type Card = {
    color: CardColor;       
    type: "Number" | "Skip" | "Reverse" | "Draw Two" | "Wild" | "Wild Draw Four";     
    value?: number;
    changeColor?(col: CardColor);
}