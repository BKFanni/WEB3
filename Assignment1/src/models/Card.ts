export enum Color {
    Red = "Red",
    Green = "Green",
    Blue = "Blue",
    Yellow = "Yellow",
    None = "None" 
}

export enum CardType {
    Number,
    Skip,
    Reverse,
    DrawTwo,
    Wild,
    WildDrawFour
}

export interface Card {
    color: Color;
    type: CardType;
    value: number; 
}
