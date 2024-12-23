"use client"
import { getGameInfo } from '@/app/api/game/game-actions'
import { isError, sleep } from '@/app/models/utils'
import React, { useEffect, useState } from 'react'
import "@/app/game/game-style.css"
import { Card, LimitedGameInfo } from '@/app/models/gameTypes'

type GameDisplayParams = {
    gameId: string
}

type PlayerTitleParams = {
    username: string
}

const PlayerTitle: React.FC<PlayerTitleParams> = ({username}) => {
    return (
        <span className='player-name'>{username}</span>
    )
}

const GameDisplay: React.FC<GameDisplayParams> = ({gameId}) => {
    const [gameInfo, setGames] = useState<LimitedGameInfo>()
    const [lastCard, updateLastCard] = useState<Card | null>(null)
    
    useEffect(() => {
        const updateInfo = async () => {
            try {
                const result = await getGameInfo(gameId)
                setGames(result)
                await sleep(100)
            } catch (err) {
                if (isError(err))
                    console.error("Error fetching game data!", err.message)
            }
        }

        updateInfo()
    }, [gameId])

    const checkLastCard = (): Card | undefined => {
        if (!gameInfo || gameInfo.discardPile.length-1 < 0) {
            updateLastCard(null)
            return
        }

        updateLastCard(gameInfo.discardPile[gameInfo.discardPile.length-1])
        return gameInfo.discardPile[gameInfo.discardPile.length-1]
    }

    return (
        <div>
            <h3>{(gameInfo && gameInfo.players.length > 1) ? <PlayerTitle username={gameInfo.name}/> : "Waiting for players..."}</h3>
            <div className="discard-pile">
                <p>Top of Discard Pile:</p>
                <div className={
                    ["card", checkLastCard() && lastCard ? lastCard : ""].join(" ")
                }>
                    { checkLastCard() && lastCard ? lastCard.value : "-" }
                </div>
            </div>
        </div>
    )
}

export default GameDisplay
