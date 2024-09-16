// Note: from tests I didn't understand what is "Hand" supposed to do?
// Is it holding info about player's cards or handling moves for all players?
// I assumed it's handling info, but idk. We will need to change Hand and Uno files anyway for them to work


export interface Hand {
    readonly playerName: string
    readonly playerId: number
}

export function createHand(name: string, id: number): Hand {
    let hand: Hand = {
        playerName: name,
        playerId: id
    }

    return hand
}