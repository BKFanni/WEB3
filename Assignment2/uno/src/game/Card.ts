export type Card = {
    color: "Red" | "Green" | "Blue" | "Yellow" | "Wild";       
    type: "Number" | "Skip" | "Reverse" | "Draw Two" | "Wild" | "Wild Draw Four";     
    value?: number;     
}