export type Card = {
    color: "Red" | "Green" | "Blue" | "Yellow";       
    type: "Number" | "Skip" | "Reverse" | "Draw Two" | "Wild" | "Wild Draw Four";     
    value?: number;
    changeColor?(col: "Red" | "Green" | "Blue" | "Yellow");
}