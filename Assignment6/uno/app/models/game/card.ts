export enum Color {
    Red = "Red",
    Blue = "Blue",
    Green = "Green",
    Yellow = "Yellow",
    Wild = "Wild"
}

export enum CardType {
    Number = "Number",
    DrawTwo = "DrawTwo",
    Skip = "Skip",
    Reverse = "Reverse",
    Wild = "Wild",
    WildDrawFour = "WildDrawFour"
}

export type Card = {
    cardId: number
    color: Color
    cardType: CardType
    value?: number 
}