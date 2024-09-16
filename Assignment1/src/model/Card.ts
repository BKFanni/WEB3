export enum Color {
    Red = 'Red',
    Green = 'Green',
    Blue = 'Blue',
    Yellow = 'Yellow',
    Wild = 'Wild'  
  }
  
  export enum CardType {
    Number = 'Number',
    Skip = 'Skip',
    Reverse = 'Reverse',
    DrawTwo = 'Draw Two',
    Wild = 'Wild',
    WildDrawFour = 'Wild Draw Four'
  }
  
  export interface Card {
    color: Color;       
    type: CardType;     
    value?: number;     
  }