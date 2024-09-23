export interface Hand {
    onEnd(arg: (e: any) => number): any;
    score: any;
    winner: any;
    hasEnded: any;
    sayUno(arg: number): any;
    catchUnoFailure(arg0: { accuser: number; accused: number }): any;
    playerCount: any;
    player: any;
    draw(): any;
    canPlayAny(): any;
    drawPile(): any;
    canPlay: any;
    discardPile(): any;
    playerInTurn(): any;
    playerHand: any;
    play(number: number, color?: string): any;

}

export function createHand(name: string, id: number): Hand {
    let score = 0;
    let winner = false;
    let hasEnded = false;
    let playerCount = 0;
    let player = 0;
    let canPlay = false;
    let playerHand: { number: number, color: string }[] = [];
    let drawPileCards: { number: number, color: string }[] = [];
    let discardPileCards: { number: number, color: string }[] = [];
    let turnPlayer = 0;

    const onEnd = (callback: (e: any) => number): unknown => {
        if (hasEnded) return callback({ winner });
        return null;
    };

    const sayUno = (playerId: number): unknown => {
        if (playerHand.length === 1) {
            return `Player ${playerId} says UNO!`;
        }
        return `Player ${playerId} cannot say UNO yet!`;
    };

    const catchUnoFailure = (arg0: { accuser: number; accused: number }) => {
        if (playerHand.length === 1) {
            return `Player ${arg0.accuser} accuses player ${arg0.accused} of not saying UNO.`;
        }
        return `Player ${arg0.accuser} made a false accusation.`;
    };

    const draw = () => {
        if (drawPileCards.length > 0) {
            const card = drawPileCards.pop();
            if (card) playerHand.push(card);
            return card;
        }
        return null;
    };

    const canPlayAny = () => {
        return playerHand.some(card => canPlayCard(card, discardPileCards[discardPileCards.length - 1]));
    };

    const drawPile = () => drawPileCards;

    const discardPile = () => discardPileCards;

    const playerInTurn = () => turnPlayer;

    const play = (number: number, color?: string): unknown => {
        const cardIndex = playerHand.findIndex(card => card.number === number && (color ? card.color === color : true));
        if (cardIndex > -1) {
            const card = playerHand.splice(cardIndex, 1)[0];
            discardPileCards.push(card);
            if (playerHand.length === 0) {
                winner = true;
                hasEnded = true;
            }
            return card;
        }
        return null;
    };

    const canPlayCard = (card: { number: number, color: string }, topCard: { number: number, color: string }) => {
        return card.number === topCard.number || card.color === topCard.color;
    };

    return {
        onEnd,
        score,
        winner,
        hasEnded,
        sayUno,
        catchUnoFailure,
        playerCount,
        player,
        draw,
        canPlayAny,
        drawPile,
        canPlay,
        discardPile,
        playerInTurn,
        playerHand,
        play
    };
}
