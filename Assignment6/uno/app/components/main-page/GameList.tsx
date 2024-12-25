"use client"
import React, { useEffect, useState } from 'react'
import JoinGameButton from './JoinGameButton'
import { getGameList } from '@/app/api/game/game-actions'
import { isError, sleep } from '@/app/models/utils'
import { GameState } from '@/app/models/game/gameState'

type GameListParams = {
    playerIdHex: string
}

const GameList: React.FC<GameListParams> = ({playerIdHex}) => {
    const [games, setGames] = useState<{
        games: GameState[],
        lastFetch: Date
    }>({games: [], lastFetch: new Date(0)})

    useEffect(() => {
        const updateGames = async () => {
            try {
                if (Date.now() - games.lastFetch.getTime() < 5000)
                    await sleep(5000)

                const result = await getGameList()
                setGames({games: result, lastFetch: new Date()})
            } catch (err) {
                if (isError(err))
                    console.error("Error fetching game data!", err.message)
            }
        }

        updateGames()
    }, [games])

    return (
        <ul>
            {games.games.map((game) => (
                <li key={game.gameId}>
                    {game.name} &#40;Players: {game.players.length}/{game.maxPlayers}&#41; 
                    <JoinGameButton
                        gameId={game.gameId}
                        playerIdHex={playerIdHex}
                    />
                </li>
            ))}
        </ul>
    )
}

export default GameList
