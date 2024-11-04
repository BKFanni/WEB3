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
    color: Color;
    type: CardType;
    number?: number; 
  }
  