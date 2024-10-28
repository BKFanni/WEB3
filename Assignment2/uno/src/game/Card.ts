export enum CardColor {
    Red,
    Green,
    Blue,
    Yellow
}

export type Card = {
    color: CardColor;       
    readonly type: "Number" | "Skip" | "Reverse" | "Draw Two" | "Wild" | "Wild Draw Four";     
    readonly value?: number;
    changeColor?(col: CardColor): void;
}