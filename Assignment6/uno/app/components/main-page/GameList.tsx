"use client"
import React, { useEffect, useState } from 'react'
import JoinGameButton from './JoinGameButton'
import { getGameList } from '@/app/api/game/game-actions'
import { isError, sleep } from '@/app/models/utils'
import { Game } from '@/app/models/gameTypes'

type GameListParams = {
    playerIdHex: string
}

const GameList: React.FC<GameListParams> = ({playerIdHex}) => {
    const [games, setGames] = useState<Game[]>([])

    useEffect(() => {
        const updateGames = async () => {
            try {
                await sleep(1000)
                const result = await getGameList()
                setGames(result)
            } catch (err) {
                if (isError(err))
                    console.error("Error fetching game data!", err.message)
            }
        }

        updateGames()
    }, [games])

    return (
        <ul>
            {games.map((game) => (
                <li key={game.id}>
                    {game.name} &#40;Players: {game.players.length}/{game.maxPlayers}&#41;
                    <JoinGameButton
                        gameId={game.id}
                        playerIdHex={playerIdHex}
                    />
                </li>
            ))}
        </ul>
    )
}

export default GameList