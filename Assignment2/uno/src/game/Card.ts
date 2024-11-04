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

/**
 * Calculates the amount of points gained from the given cards
 * @param cards Cards to use
 */
export function calculatePoints(cards: Card[]): number {
    let total = 0;
    cards.forEach(c => {
        if (c.type === "Number") {
            total += c.value ?? 0;  // Use default value 0 if c.value is undefined
        }
        if (c.type === "Draw Two") { total += 20 }
        if (c.type === "Reverse") { total += 20 }
        if (c.type === "Skip") { total += 20 }
        if (c.type === "Wild") { total += 50 }
        if (c.type === "Wild Draw Four") { total += 50 }
    });
    return total;
}
